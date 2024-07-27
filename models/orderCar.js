// models/orderCar.js or models/carOrder.js

module.exports = (sequelize, DataTypes) => {
    const orderCar = sequelize.define("orderCar", {
        start: {
            type: DataTypes.STRING
        },
        end: {
            type: DataTypes.STRING  
        },
        personName: {
            type: DataTypes.STRING  
        },
        carName: {
            type: DataTypes.STRING  
        },
        totalCost: {
            type: DataTypes.STRING 
        },
        totalDays: { 
            type: DataTypes.INTEGER  
        },
        clientID : {
            type: DataTypes.INTEGER
        }
    });

    return orderCar;
};
