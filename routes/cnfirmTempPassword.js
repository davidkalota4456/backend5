
const express = require('express');
const router = express.Router();



router.post('/', async (req, res) => {
    try {
        const { temporaryPassword } = req.body;

        // Retrieve the temporary password stored in session or cache
        const storedTemporaryPassword = req.session.temporaryPassword;

        // Validate the temporary password
        if (temporaryPassword !== storedTemporaryPassword) {
            return res.status(400).json({ error: 'Invalid temporary password' });
        }

        delete req.session.temporaryPassword;

        res.status(201).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Failed to update password' });
    }
});






module.exports = router;

