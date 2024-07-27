const express = require('express');
const router = express.Router();
const { orderCar, Users, totalOrder } = require('../models'); // Import OrderCar model
const checkSession = require('../middleware/checkSession'); // Import checkSession middleware
const { sendToTotalOrders } = require('../helper/sendToTotalOrders');
const { Decimal } = require('decimal.js');

// Example route to create a new order, protected by checkSession middleware
router.post('/', checkSession, async (req, res) => {
    try {
      console.log('Session username is:', req.session.username); 
      let decimalTotalCost = new Decimal(0);
      const username = req.session.username;
      const user = await Users.findOne({ where: { userName: username } });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
          }

      const userId = user.id; // Extract the ID of the user
      const { cart } = req.body; 
  
      // Iterate over each item in the cart array
      for (let item of cart) {
        const { start, end, carName, totalDays, totalCost } = item;

        decimalTotalCost = decimalTotalCost.plus(new Decimal(totalCost))
  
        const newOrder = await orderCar.create({
          start,
          end,
          carName,
          totalDays,
          totalCost,
          personName: req.session.username,
          clientID: userId
        });
        const formattedTotalCost = decimalTotalCost.toFixed(2);

        //await sendToTotalOrders(username, parseFloat(totalCost), true, false);
        await sendToTotalOrders(username, parseFloat(formattedTotalCost), true, false);
  

        console.log(`Order created for ${carName}`);
      }
      res.json({ message: 'Orders created successfully' });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });



router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderCar.findByPk(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});





module.exports = router;
