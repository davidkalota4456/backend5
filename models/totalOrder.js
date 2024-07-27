module.exports = (sequelize, DataTypes) => {
    const totalOrder = sequelize.define("totalOrder", {
        userName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gmail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        carOrder: {
            type: DataTypes.BOOLEAN, 
        },
        amountCarOrder: {
            type: DataTypes.INTEGER, 
        },
        HouseOrder: {
            type: DataTypes.BOOLEAN, 
        },
        amountHouseOrder: {
            type: DataTypes.INTEGER, 
        },
        totalCost: {
            type: DataTypes.FLOAT,
        }    
    });

    return totalOrder;
};
