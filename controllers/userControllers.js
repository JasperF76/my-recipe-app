const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await userModel.registerUser(username, email, password);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.loginUser(email, password);
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ error: 'Invalid email or password' });
    }
};

module.exports = {
    register,
    login
}