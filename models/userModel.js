const pool = require('../config/db');
const bcrypt = require('bcrypt');

const registerUser = async (username, email, password, is_admin) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        'INSERT INTO users (username, email, password, is_admin) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_admin',
        [username, email, hashedPassword, is_admin]
    );
    return result.rows[0];
};

const loginUser = async (email, password) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('Invalid password');
    }

    return user;
};

const followUser = async (followerId, followedId) => {
    const checkExistingFollow = await pool.query(
        'SELECT * FROM follows WHERE follower_id = $1 AND followed_id = $2',
        [followerId, followedId]
    );
    
    if (checkExistingFollow.rows.length > 0) {
        return { message: 'You are already following this user' };
    }

    const result = await pool.query(
        'INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) RETURNING*',
        [followerId, followedId]
    );
    return result.rows[0];
};

module.exports = { registerUser, loginUser, followUser };