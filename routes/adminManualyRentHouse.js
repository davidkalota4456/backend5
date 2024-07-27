const express = require('express');
const router = express.Router();
const { RentHouse, orderCar, houses , Users, totalOrder} = require('../models');  
const checkSession = require('../middleware/checkSession');
const { where } = require('sequelize');
const { sendToTotalOrders } = require('../helper/sendToTotalOrders');
const { Decimal } = require('decimal.js');


router.post('/', async (req, res) => {
    try {
        const { cart, personName } = req.body;

        const person = await Users.findOne({ where: { userName: personName } });
        if (!person) {
            return res.status(404).json({ error: `User ${personName} not found` });
        }
        const personID = person.id;

        const rentHouseIds = [];
        let decimalTotalCost = new Decimal(0);

        for (let item of cart) {
            const { start, end, totalDays, hotelName, rentCarAlsoId, totalCost } = item;

            const house = await houses.findOne({ where: { hotelName: hotelName } });
            if (!house) {
                return res.status(404).json({ error: `Hotel ${hotelName} not found` });
            }

            if (house.availableRooms > 0) {
                house.availableRooms -= 1;
                house.takenRooms += 1;
                await house.save();
            } else {
                return res.status(400).json({ error: `No rooms available at ${hotelName}` });
            }

            if (rentCarAlsoId) {
                const order = await orderCar.findByPk(rentCarAlsoId);
                if (!order) {
                    return res.status(404).json({ error: `Order car ${rentCarAlsoId} not found` });
                }
            }

            const newRentHouse = await RentHouse.create({
                start,
                end,
                personName,
                rentCarAlsoId,
                totalCost,
                totalDays,
                hotelName,
                clientID: personID
            });

            rentHouseIds.push(newRentHouse.id);
            decimalTotalCost = decimalTotalCost.plus(new Decimal(totalCost));
        }

        const formattedTotalCost = decimalTotalCost.toFixed(2);

        await sendToTotalOrders(personName, parseFloat(formattedTotalCost), false, true);

        res.json({ message: 'Rent houses created successfully', rentHouseIds });
    } catch (error) {
        console.error('Error creating rent house:', error);
        res.status(500).json({ error: 'Failed to create rent house' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { totalDays, hotelName } = req.query;

        // Ensure totalDays is a number
        const days = parseInt(totalDays, 10);
        if (isNaN(days) || days <= 0) {
            return res.status(400).json({ error: 'Invalid totalDays value' });
        }

        // Fetch the house details using the hotel name
        const house = await houses.findOne({ where: { hotelName: hotelName } });
        if (!house) {
            return res.status(404).json({ error: `Hotel ${hotelName} not found` });
        }

        // Calculate the total price
        const totalPrice = house.pricePerNight * days;

        // Send the total price in the response
        res.json({ totalPrice });
    } catch (error) {
        console.error('Error calculating total price:', error);
        res.status(500).json({ error: 'Failed to calculate total price' });
    }
});

module.exports = router;