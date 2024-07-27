
const express = require("express");
const router = express.Router();
const { Cars, orderCar } = require("../models");


router.get("/", async (req, res) => {
    try {
        // Fetch all cars from the Cars table
        const listOfCars = await Cars.findAll();

        // Format the response as needed
        const formattedResponse = listOfCars.map(car => ({
            id: car.id,
            name: car.name,
            pricePerDay: car.pricePerDay,
            year: car.year,
            
        }));

        // Respond with the formatted list of all cars
        res.json(formattedResponse);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Error fetching data" });
    }
});



// POST a new car
router.post("/", async (req, res) => {
    const data = req.body;
    const { name } = data; // Assuming 'name' is a field in your car data

    try {
        // Check if the car already exists
        const existingCar = await Cars.findOne({ where: { name: name } });
        if (existingCar) {
            return res.status(400).json({ error: 'This car already exists' });
        }

        // Create a new car
        const newCar = await Cars.create(data);
        res.status(201).json(newCar);
    } catch (err) {
        console.error("Error creating car:", err);
        res.status(500).json({ error: "Error creating car" });
    }
});



router.delete("/:name", async (req, res) => {
    const carName = req.params.name;
    try {
        const car = await Cars.findOne({ where: { name: carName } });
        if (car) {
            await car.destroy();
            res.json({ message: "Car deleted successfully" });
        } else {
            res.status(404).json({ error: "Car not found" });
        }
    } catch (err) {
        console.error("Error deleting car:", err);
        res.status(500).json({ error: "Error deleting car" });
    }
});



module.exports = router;