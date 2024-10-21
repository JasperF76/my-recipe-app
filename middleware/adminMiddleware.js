const pool = require('../config/db');

const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ error: 'Access denied. Admins only' });
    }
    next();
};

module.exports = authorizeAdmin;