const express = require('express');
const router = express.Router();
const { houses } = require('../models');
const { Sequelize } = require('sequelize');
const { Op } = require("sequelize");

// Create a new house
router.post('/', async (req, res) => {
    const { hotelName, location, availableRooms, pricePerNight, takenRooms } = req.body;

    try {
        const existingHouse = await houses.findOne({ where: { hotelName: hotelName } });
        if (existingHouse) {
            return res.status(400).json({ error: 'House with this name already exists' });
        }

        const newHouse = await houses.create({
            hotelName,
            location,
            availableRooms,
            pricePerNight,
            takenRooms
        });

        res.json({ message: 'House created successfully', house: newHouse });
    } catch (error) {
        console.error('Error creating house:', error);
        res.status(500).json({ error: 'Failed to create house' });
    }
});



// Get all houses
router.get('/', async (req, res) => {
    const { all } = req.query;
    try {
        let allHouses;

        if (all === 'true') {
            // Fetch all houses without any conditions
            allHouses = await houses.findAll();
        } else {
            // Fetch houses where availableRooms > 0
            allHouses = await houses.findAll({
                where: {
                    availableRooms: {
                        [Op.gt]: 0
                    }
                }
            });
        }

        res.json(allHouses);
    } catch (error) {
        console.error('Error fetching houses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get a house by ID
router.get('/:id', async (req, res) => {
    try {
        const house = await houses.findByPk(req.params.id);
        if (house) {
            res.json(house);
        } else {
            res.status(404).json({ error: 'House not found' });
        }
    } catch (error) {
        console.error('Error fetching house:', error);
        res.status(500).json({ error: 'Failed to fetch house' });
    }
});



// Update a house by ID
router.put('/:id', async (req, res) => {
    const { hotelName, location, availableRooms, pricePerNight, takenRooms } = req.body;

    try {
        const house = await houses.findByPk(req.params.id);
        if (house) {
            await house.update({
                hotelName,
                location,
                availableRooms,
                pricePerNight,
                takenRooms
            });
            res.json({ message: 'House updated successfully', house });
        } else {
            res.status(404).json({ error: 'House not found' });
        }
    } catch (error) {
        console.error('Error updating house:', error);
        res.status(500).json({ error: 'Failed to update house' });
    }
});

// Delete a house by ID
router.delete('/:id', async (req, res) => {
    try {
        const house = await houses.findByPk(req.params.id);
        if (house) {
            await house.destroy();
            res.json({ message: 'House deleted successfully' });
        } else {
            res.status(404).json({ error: 'House not found' });
        }
    } catch (error) {
        console.error('Error deleting house:', error);
        res.status(500).json({ error: 'Failed to delete house' });
    }
});


router.put('/:id/increment', async (req, res) => {
    try {
        const house = await houses.findByPk(req.params.id);
        if (house) {
            house.availableRooms += 1;
            await house.save();
            res.json({ message: 'Available rooms incremented successfully', house });
        } else {
            res.status(404).json({ error: 'House not found' });
        }
    } catch (error) {
        console.error('Error incrementing available rooms:', error);
        res.status(500).json({ error: 'Failed to increment available rooms' });
    }
});


// Decrement availableRooms by ID
router.put('/:id/decrement', async (req, res) => {
    try {
        const house = await houses.findByPk(req.params.id);
        if (house) {
            house.availableRooms -= 1;
            await house.save();
            res.json({ message: 'Available rooms decremented successfully', house });
        } else {
            res.status(404).json({ error: 'House not found' });
        }
    } catch (error) {
        console.error('Error decrementing available rooms:', error);
        res.status(500).json({ error: 'Failed to decrement available rooms' });
    }
});


router.put("/:hotelName", async (req, res) => {
    const hotelName = req.params.hotelName;
    const { pricePerNight, location, availableRooms, takenRooms } = req.body;

    try {
        // Find the house by hotelName
        const houseToUpdate = await houses.findOne({
            where: {
                hotelName: hotelName
            }
        });

        if (!houseToUpdate) {
            return res.status(404).json({ error: `House '${hotelName}' not found` });
        }

        // Update the house fields
        houseToUpdate.pricePerNight = pricePerNight;
        houseToUpdate.location = location;
        houseToUpdate.availableRooms = availableRooms;
        houseToUpdate.takenRooms = takenRooms;

        // Save the updated house
        await houseToUpdate.save();

        // Respond with success message and updated house data
        res.status(200).json({
            message: `House '${hotelName}' updated successfully`,
            house: houseToUpdate
        });
    } catch (error) {
        console.error('Error updating house:', error);
        res.status(500).json({ error: 'Failed to update house' });
    }
});

router.delete("/:hotelName", async (req, res) => {
    const hotelName = req.params.hotelName;

    try {
        // Find the house by hotelName
        const houseToDelete = await houses.findOne({
            where: {
                hotelName: hotelName
            }
        });

        if (!houseToDelete) {
            return res.status(404).json({ error: `House '${hotelName}' not found` });
        }

        // Delete the house
        await houseToDelete.destroy();

        // Respond with success message
        res.json({ message: `House '${hotelName}' deleted successfully` });
    } catch (error) {
        console.error('Error deleting house:', error);
        res.status(500).json({ error: 'Failed to delete house' });
    }
});




module.exports = router;
