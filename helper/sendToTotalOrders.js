const { Users, totalOrder } = require('../models');
const { amountOffCarOrder } = require('./orderHelpers');

const sendToTotalOrders = async (userName, addPrice, isCarOrder, isHouseOrder) => {
    try {
        const user = await Users.findOne({ where: { userName } });
        if (!user) {
            throw new Error(`User with username ${userName} not found`);
        }

        const gmail = user.gmail;
        
        const { countCarOrder, countHouseOrder } = await amountOffCarOrder(userName);

        let carOrder = isCarOrder && countCarOrder > 0;

        let houseOrder = isHouseOrder && countHouseOrder > 0;

        let totalOrderRecord = await totalOrder.findOne({ where: { userName } });

        if (!totalOrderRecord) {
            totalOrderRecord = await totalOrder.create({
                userName,
                gmail,
                carOrder,
                amountCarOrder: isCarOrder ? countCarOrder : 0,
                HouseOrder: houseOrder,
                amountHouseOrder: isHouseOrder ? countHouseOrder : 0,
                totalCost: addPrice
            });

        } else {
            if (isCarOrder) {
                totalOrderRecord.carOrder = true;
                totalOrderRecord.amountCarOrder = countCarOrder;
                totalOrderRecord.totalCost += addPrice;
            }

            if (isHouseOrder) {
                totalOrderRecord.HouseOrder = true;
                totalOrderRecord.amountHouseOrder = countHouseOrder;
                totalOrderRecord.totalCost += addPrice;
            }

            totalOrderRecord.totalCost += addPrice;
            await totalOrderRecord.save();
        }

        console.log('Total order updated/created successfully');
    } catch (error) {
        console.error('Error in sendToTotalOrders:', error);
        throw error;
    }
};

module.exports = { sendToTotalOrders };
