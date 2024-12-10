const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided or malformed token' });
    }

    try {
        const actualToken = token.split(' ')[1];
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded);
        
        req.user = {
            id: decoded.id,
            username: decoded.username,
            is_admin: decoded.is_admin || false
        };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;