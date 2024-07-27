module.exports = (sequelize, DataTypes) => {
    const RentHouse = sequelize.define("RentHouse", {
        start: {
            type: DataTypes.STRING
        },
        end: {
            type: DataTypes.STRING  
        },
        personName: {
            type: DataTypes.STRING  
        },
        rentCarAlsoId: {
            type: DataTypes.INTEGER,
            allowNull: true
            // Remove the references field
        },
        totalCost: {
            type: DataTypes.STRING
        },
        totalDays: {
            type: DataTypes.INTEGER  
        },
        hotelName: {
            type: DataTypes.STRING
        },
        
        clientID: {
            type: DataTypes.INTEGER
        }
    });

    

    return RentHouse;
};
