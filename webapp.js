const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./models');
const checkSession = require('./middleware/checkSession');
const { Sequelize } = require('sequelize');
const path = require('path')
require('dotenv').config();


const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000,
    },
    
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());



const rentHouseRouter = require('./routes/rentHouse');
const usersRouter = require('./routes/users');
const register = require('./routes/register');
const totalOrderRouter = require('./routes/totalOrder');
const rentCarRouter = require('./routes/rentCar');
const orderCarRouter = require('./routes/orderCar');
const housesRouter = require('./routes/houses');
const totalOrderRoutes = require('./routes/totalOrder');
const passwordResetRequestRouter = require('./routes/forgetPassword'); 
const passwordResetConfirmRouter = require('./routes/cnfirmTempPassword'); 
const newpasswordConfirmRouter = require('./routes/newPassword'); 
const imagesRouter = require('./routes/image');
const bookingRouter = require('./routes/booking');
const manualOrderRouter = require('./routes/adminManualyRentHouse');
const folderCreatoionRouter = require('./routes/createFolder');
const manualCarOrderRouter = require('./routes/adminManualyRentCar')



app.use('/rentHouse', checkSession, rentHouseRouter);
app.use('/users', usersRouter);
app.use('/rentCar', rentCarRouter);
app.use('/orderCar', checkSession, orderCarRouter);
app.use('/houses', housesRouter);
app.use('/register', register);
app.use('/totalOrder', totalOrderRouter);
app.use('/totalOrders', totalOrderRoutes);
app.use('/forgetPassword', passwordResetRequestRouter);
app.use('/cnfirmTempPassword', passwordResetConfirmRouter);
app.use('/newPassword', newpasswordConfirmRouter);
app.use('/image', imagesRouter);
app.use('/booking', bookingRouter);
app.use('/createFolder', folderCreatoionRouter);
app.use('/adminManualyRentHouse', manualOrderRouter);
app.use('/adminManualyRentCar', manualCarOrderRouter)





db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server running on port 3001');
    });
}).catch(error => {
    console.error('Error syncing database:', error);
});

