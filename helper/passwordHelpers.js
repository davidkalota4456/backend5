const { Users } = require('../models');
const bcrypt = require('bcrypt');



const generateTemporaryPassword = () => {
    const length = 5;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let temporaryPassword = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        temporaryPassword += charset[randomIndex];
    }

    return temporaryPassword;
};

const updateUserPassword = async (email, newPassword) => {
    try {
        // Update user's password in the database
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Example update query (replace with your actual update logic)
        await Users.update({ password: hashedPassword }, { where: { gmail: email } });

        console.log(`Password updated for user with email ${email}`);
    } catch (error) {
        console.error('Error updating user password:', error);
        throw error;
    };
}    








module.exports = { generateTemporaryPassword, updateUserPassword };
