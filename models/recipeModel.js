const pool = require('../config/db');

const getAllRecipes = async () => {
    const result = await pool.query('SELECT * FROM recipes');
    return result.rows;
};

const getRecipeById = async (recipeId) => {
    const result = await pool.query('SELECT * FROM recipes WHERE id = $1', [recipeId]);
    return result.rows[0];
};

const createRecipe = async (recipeData) => {
    const { title, description, ingredients, instructions, category, image_url, user_id } = recipeData;
    const result = await pool.query(
        'INSERT INTO recipes (title, description, ingredients, instructions, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING*',
        [title, description, ingredients, instructions, image_url, user_id]
    );
    return result.rows[0];
};

const updateRecipe = async (recipeId, recipeData, userId = null) => {
    const { title, description, ingredients, instructions, image_url } = recipeData;
    let query;
    let values;

    if (userId) {
        query = `
        UPDATE recipes
        SET title = $1, description = $2, ingredients = $3, instructions = $4, image_url = $5, updated_at = NOW()
        WHERE id = $6 AND user_id = $7 RETURNING *
        `;
        values = [title, description, ingredients, instructions, image_url, recipeId, userId];
    } else {
        query = `
        UPDATE recipes
        SET title = $1, description = $2, ingredients = $3, instructions = $4, image_url = $5, updated_at = NOW()
        WHERE id = $6 RETURNING *
        `;
        values = [title, description, ingredients, instructions, image_url, recipeId];
    }

    const result = await pool.query(query, values);
    return result.rows[0];
};

const deleteRecipe = async (recipeId, userId = null) => {
    let query;
    let values;

    if (userId) {
        query = 'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *';
        values = [recipeId, userId];
    } else {
        query = 'DELETE FROM recipes WHERE id = $1 RETURNING *';
        values = [recipeId];
    }

    const result = await pool.query(query, values);
    return result.rowCount > 0;
};

const getCommentsForRecipe = async (recipeId) => {
    const result = await pool.query('SELECT * FROM recipe_comments WHERE recipe_id = $1', [recipeId]);
    return result.rows;
};

const addCommentToRecipe = async (recipeId, commentData) => {
    const { user_id, comment } = commentData;
    const result = await pool.query(
        'INSERT INTO recipe_comments (user_id, recipe_id, comment) VALUES ($1, $2, $3) RETURNING *',
        [user_id, recipeId, comment]
    );
    return result.rows[0];
};

const addReplyToComment = async (commentId, replyData) => {
    const { user_id, reply } = replyData;
    const result = await pool.query(
        'INSERT INTO recipe_replies (user_id, comment_id, reply) VALUES ($1, $2, $3) RETURNING *',
        [user_id, commentId, reply]
    );
    return result.rows[0];
};

const likeRecipe = async (recipeId, userId) => {
    const result = await pool.query(
        'INSERT INTO recipe_likes (user_id, recipe_id) VALUES ($1, $2) RETURNING *',
        [userId, recipeId]
    );
    return result.rows[0];
};

const favoriteRecipe = async (recipeId, userId) => {
    const result = await pool.query(
        'INSERT INTO recipe_favorites (user_id, recipe_id) VALUES ($1, $2) RETURNING *',
        [userId, recipeId]
    );
    return result.rows[0];
};

const getFavoritesByUser = async (userId) => {
    const result = await pool.query(
        'SELECT * FROM recipes INNER JOIN recipe_favorites ON recipes.id = recipe_favorites.recipe_id WHERE recipe_favorites.user_id = $1',
        [userId]
    );
    return result.rows;
};

const getTagsForRecipe = async (recipeId) => {
    const result = await pool.query(
        'SELECT t.name FROM recipe_tags t INNER JOIN recipe_tag_relations rtr ON t.id = rtr.tag_id WHERE rtr.recipe_id = $1',
        [recipeId]
    );
    return result.rows;
};

const addTagToRecipe = async (recipeId, tagId) => {
    const result = await pool.query(
        'INSERT INTO recipe_tag_relations (recipe_id, tag_id) VALUES ($1, $2) RETURNING *',
        [recipeId, tagId]
    );
    return result.rows[0];
};

const followUser = async (followerId, followedId) => {
    const result = await pool.query(
        'INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) RETURNING *',
        [followerId, followedId]
    );
    return result.rows[0];
};

module.exports = {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getCommentsForRecipe,
    addCommentToRecipe,
    addReplyToComment,
    likeRecipe,
    favoriteRecipe,
    getFavoritesByUser,
    getTagsForRecipe,
    addTagToRecipe
};