const express = require('express');
const router = express.Router();
const { sendResetEmail } = require('../helper/emailService');
const { generateTemporaryPassword } = require('../helper/passwordHelpers'); // Import your password helpers

// Route to handle password reset request
router.post('/', async (req, res) => {
    try {
        const { email } = req.body;

        const temporaryPassword = generateTemporaryPassword(); 
        req.session.temporaryPassword = temporaryPassword;
        
        req.session.email = email;

        sendResetEmail(email, temporaryPassword);

        res.status(201).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = router;
