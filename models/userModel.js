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

const getFavoritesByUser = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM recipes INNER JOIN recipe_favorites ON recipes.id = recipe_favorites.recipe_id WHERE recipe_favorites.user_id = $1',
        [userId]
    );
    return result.rows;
};

const toggleFollowUser = async (followerId, followedId) => {
    const checkFollow = await pool.query(
        'SELECT * FROM follows WHERE follower_id = $1 AND followed_id = $2',
        [followerId, followedId]
    );

    if (checkFollow.rows.length > 0) {
        // Unfollow the user (remove from follows)
        const unfollowResult = await pool.query(
            'DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2 RETURNING *',
            [followerId, followedId]
        );
        return { message: 'User unfollowed', unfollowResult: unfollowResult.rows[0] };
    } else {
        // Follow the user (insert into follows)
        const followResult = await pool.query(
            'INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) RETURNING *',
            [followerId, followedId]
        );
        return { message: 'User followed', followResult: followResult.rows[0] };
    }
};

const getAllUsers = async () => {
    const result = await pool.query(
        'SELECT id, username, email, is_admin FROM users ORDER by username ASC'
    );
    return result.rows;
};

module.exports = { registerUser, loginUser, getFavoritesByUser, toggleFollowUser, getAllUsers };