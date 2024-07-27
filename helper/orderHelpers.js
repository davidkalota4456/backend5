// helpers/orderHelpers.js

const { Users, orderCar, RentHouse } = require('../models'); // Adjust the path to your models

// Function to count the number of car orders and house orders for a user by their username
const amountOffCarOrder = async (username) => {
    try {
        const user = await Users.findOne({ where: { userName: username } });
        if (!user) {
            throw new Error(`User with username ${username} not found`);
        }

        const userId = user.id;
        
        const countCarOrder = await orderCar.count({
            where: { clientID: userId }
        });
        
        const countHouseOrder = await RentHouse.count({
            where: { clientID: userId }
        });

        return { countCarOrder, countHouseOrder };
    } catch (error) {
        console.error('Error counting orders:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
};

module.exports = { amountOffCarOrder };
