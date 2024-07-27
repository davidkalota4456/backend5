const express = require('express');
const router = express.Router();
const { orderCar } = require('../models'); // Import your Sequelize model

router.get('/', async (req, res) => {
  try {
    // Query all orders
    const allOrders = await orderCar.findAll();

    // Initialize an object to store grouped bookings
    const groupedBookings = {};

    // Group orders by carName
    allOrders.forEach(order => {
      const { start, end, carName } = order;
      if (!groupedBookings[carName]) {
        groupedBookings[carName] = [];
      }
      groupedBookings[carName].push({ startDate: start, endDate: end });
    });

    // Convert groupedBookings object to array format
    const bookingsArray = Object.keys(groupedBookings).map(carName => ({
      carName,
      bookings: groupedBookings[carName]
    }));

    // Send the response
    res.json(bookingsArray);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;
