const express = require('express');
const router = express.Router();
const { RentHouse, orderCar, houses , Users, totalOrder} = require('../models');  
const checkSession = require('../middleware/checkSession');
const { where } = require('sequelize');
const { sendToTotalOrders } = require('../helper/sendToTotalOrders');
const { Decimal } = require('decimal.js');


// POST route to create a new RentHouse entry
router.post('/', checkSession, async (req, res) => {
    try {
        const { cart } = req.body;
        const personNameSession = req.session.username;

        const person = await Users.findOne({ where: { userName: personNameSession } });
        if (!person) {
            return res.status(404).json({ error: `User ${personNameSession} not found` });
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
                personName: personNameSession,
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
        
        await sendToTotalOrders(personNameSession, parseFloat(formattedTotalCost), false, true);

        res.json({ message: 'Rent houses created successfully', rentHouseIds });
    } catch (error) {
        console.error('Error creating rent house:', error);
        res.status(500).json({ error: 'Failed to create rent house' });
    }
});



// GET a specific rent house by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const rentHouse = await RentHouse.findByPk(id);

        if (!rentHouse) {
            return res.status(404).json({ error: 'Rent house not found' });
        }

        if (rentHouse.rentCarAlsoId === null) {
            console.log(rentHouse)
            return res.json(rentHouse);
        }
        const associatedOrderCar = await orderCar.findByPk(rentHouse.rentCarAlsoId);

        if (!associatedOrderCar) {
            // If associated orderCar is not found, return rentHouse data only
            return res.json(rentHouse);
        }

        // Combine rentHouse and associatedOrderCar into a single object
        const combinedData = {
            id: rentHouse.id,
            start: rentHouse.start,
            end: rentHouse.end,
            personName: rentHouse.personName,
            rentCarAlsoId: rentHouse.rentCarAlsoId,
            totalCost: rentHouse.totalCost,
            totalDays: rentHouse.totalDays,
            hotelName: rentHouse.hotelName,
            orderCar: {
                id: associatedOrderCar.id,
                start: associatedOrderCar.start,
                end: associatedOrderCar.end,
                personName: associatedOrderCar.personName,
                carName: associatedOrderCar.carName,
                totalCost: associatedOrderCar.totalCost,
                totalDays: associatedOrderCar.totalDays
            }
        };

        return res.json(combinedData);

    } catch (error) {
        console.error('Error fetching rent house:', error);
        res.status(500).json({ error: 'Failed to fetch rent house' });
    }
});



router.get('/', async (req, res) => {
    try {
        const rentHouses = await RentHouse.findAll();
        if (rentHouses.length > 0) {
            res.json(rentHouses);
        } else {
            res.status(404).json({ error: 'No rent houses found' });
        }
    } catch (error) {
        console.error('Error fetching rent houses:', error);
        res.status(500).json({ error: 'Failed to fetch rent houses' });
    }
});




module.exports = router;
