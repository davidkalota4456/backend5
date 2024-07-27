const express = require('express');
const router = express.Router();
const { RentHouse, orderCar, houses , Users, totalOrder, Cars} = require('../models');  
const checkSession = require('../middleware/checkSession');
const { where } = require('sequelize');
const { sendToTotalOrders } = require('../helper/sendToTotalOrders');
const { Decimal } = require('decimal.js');
const { Op } = require('sequelize');
const rentCar = require('../models/rentCar');



router.post('/', async (req, res) => {
  try {
    const { personName, cart } = req.body;
    const user = await Users.findOne({ where: { userName: personName } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = user.id; // Extract the ID of the user

    for (let item of cart) {
      const { carName, start, end,  totalDays, totalCost } = item;

      console.log('carName:', carName);
      console.log('start:', start);
      console.log('end:', end);

      // Check for overlapping orders

const overlappingOrders = await orderCar.findOne({
        where: {
          carName :carName,
          [Op.and]: [
            {
              start: {
                [Op.between]: [start, end]
              }
            },
            {
              end: {
                [Op.between]: [start, end]
              }
            },
            {
              [Op.and]: [
                {
                  start: {
                    [Op.lte]: start
                  }
                },
                {
                  end: {
                    [Op.gte]: end
                  }
                }
              ]
            }
          ]
        }
      });
      

      if (overlappingOrders) {
        return res.status(400).json({ error: `Order for ${carName} overlaps with existing orders` });
      }

      // Create the new order
      const newOrder = await orderCar.create({
        start,
        end,
        carName,
        totalDays,
        totalCost,
        personName: user.userName,
        clientID: userId
      });

      await sendToTotalOrders(user.userName, parseFloat(totalCost), true, false);
      console.log(`Order created for ${carName}`);
    }
    res.json({ message: 'Orders created successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});



router.get('/', async (req, res) => {
    try {
        const { totalDays, carName } = req.query;

        // Ensure totalDays is a number
        const days = parseInt(totalDays, 10);
        if (isNaN(days) || days <= 0) {
            return res.status(400).json({ error: 'Invalid totalDays value' });
        }

        // Fetch the house details using the hotel name
        const car = await Cars.findOne({ where: { name: carName } });
        if (!car) {
            return res.status(404).json({ error: `CAR ${car} not found` });
        }

        // Calculate the total price
        const totalPrice = car.pricePerDay * days;

        // Send the total price in the response
        res.json({ totalPrice });
    } catch (error) {
        console.error('Error calculating total price:', error);
        res.status(500).json({ error: 'Failed to calculate total price' });
    }
});

module.exports = router;