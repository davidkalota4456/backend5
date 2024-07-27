module.exports = (sequelize, DataTypes) => {
    const Cars = sequelize.define("Cars", {
        name: {
            type: DataTypes.STRING
        },
        pricePerDay: {
            type: DataTypes.INTEGER  
        },
        year: {
            type: DataTypes.INTEGER  
        }
    });

    return Cars;
};
