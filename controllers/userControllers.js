const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

const register = async (req, res) => {
    const { username, email, password, is_admin } = req.body;
    try {
        const newUser = await userModel.registerUser(username, email, password, is_admin);
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

const getFavoritesByUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const favorites = await userModel.getFavoritesByUser(userId);
        res.status(200).json(favorites);
    } catch (error) {
        console.log(error);        
        res.status(500).json({ error: 'Failed to retrieve favorites' });
    }
};

const followUser = async (req, res) => {
    const followerId = req.user.id;
    const followedId = req.params.userId;
    try {
        const follow = await userModel.followUser(followerId, followedId);

        if (follow.message) {
            return res.status(400).json({ error: follow.message });
        }

        res.status(201).json(follow);
    } catch (error) {
        res.status(500).json({ error: 'Failed to follow user' });
    }
};

module.exports = {
    register,
    login,
    getFavoritesByUser,
    followUser
}