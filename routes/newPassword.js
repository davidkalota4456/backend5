
const express = require('express');
const router = express.Router();
const {  updateUserPassword } = require('../helper/passwordHelpers');


router.post('/', async (req, res) => {
    try {
        const { newPassword } = req.body;
        const email = req.session.email;


        // Update user's password in the database
        await updateUserPassword(email, newPassword);

        // Clear the temporary password from session or cache after use
        delete req.session.email;

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
});




module.exports = router;

