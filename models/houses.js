module.exports = (sequelize, DataTypes) => {
    const houses = sequelize.define("houses", {
        hotelName: {
            type: DataTypes.STRING
        },
        location: {
            type: DataTypes.STRING  
        },
        availableRooms: {
            type: DataTypes.INTEGER  
        },
        pricePerNight: {
            type: DataTypes.STRING
        },
        
        takenRooms: {
            type: DataTypes.INTEGER
        }
    });


    return houses;
};
