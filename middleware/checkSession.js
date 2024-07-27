// middleware/checkSession.js

const checkSession = (req, res, next) => {
    // Check if the request method is POST and ensure session exists
    if (req.method === 'POST' && (!req.session || !req.session.username)) {
        return res.status(401).json({ message: 'Unauthorized: No session available' });
    }
    // For other routes or methods, continue without session checking
    next();
};

module.exports = checkSession;
