const express = require('express');
const router = express.Router();
const { totalOrder, Users } = require('../models');
const checkSession = require('../middleware/checkSession');



router.get('/', async (req, res) => {
    try {
        const orders = await totalOrder.findAll();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders: no orders yeat==');
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});


router.get('/:username', checkSession, async (req, res) => {
    try {
        const username = req.params.username;

        // Find the user
        const user = await Users.findOne({ where: { userName: username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find the total orders for the user
        const userTotalOrder = await totalOrder.findOne({ where: { userName: username } });
        if (!userTotalOrder) {
            return res.status(404).json({ error: 'Total order information not found for this user' });
        }

        // Respond with the total order information
        res.json(userTotalOrder);
    } catch (error) {
        console.error('Error retrieving total order information:', error);
        res.status(500).json({ error: 'Failed to retrieve total order information' });
    }
});


// POST create a new order
router.post('/', async (req, res) => {
    const { userName, gmail, carOrder, amountCarOrder, houseOrder, amountHouseOrder, totalCost  } = req.body;

    try {
        const newOrder = await totalOrder.create({
            userName,
            gmail,
            carOrder,
            amountCarOrder,
            houseOrder,
            amountHouseOrder, 
            totalCost 
        });

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

module.exports = router;
