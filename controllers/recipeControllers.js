const pool = require('../config/db');
const recipeModel = require('../models/recipeModel');

const getAllRecipes = async (req, res) => {
    try {
        const recipes = await recipeModel.getAllRecipes();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve recipes' });
    }
};

const getRecipeById = async (req, res) => {
    const { id } = req.params;
    console.log('Recipe ID:', id);
    try {
        const recipe = await recipeModel.getRecipeById(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve recipe' });
    }
};

const createRecipe = async (req, res) => {
    const userId = req.user.id;
    try {
        const newRecipe = await recipeModel.createRecipe({
            ...req.body,
            user_id: userId
        });
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create recipe' });
    }
};

const updateRecipe = async (req, res) => {
    const userId = req.user.id;
    const is_admin = req.user.is_admin;

    try {
        const recipeId = parseInt(req.params.id, 10);
        console.log({ recipeId, body: req.body, userId, is_admin });
        

        const updatedRecipe = await recipeModel.updateRecipe(recipeId, req.body, userId, is_admin);

        if (!updateRecipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.status(200).json(updatedRecipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
    
};

const deleteRecipe = async (req, res) => {
    const userId = req.user.id;
    const is_admin = req.user.is_admin;
    const { id } = req.params;
    try {
        const deleted = await recipeModel.deleteRecipe(id, userId, is_admin);
        if (!deleted) {
            return res.status(403).json({ error: 'Not authorized to delete this recipe' });
        }
        res.status(204).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
};

const getCommentsForRecipe = async (req, res,) => {
    const { id } = req.params;
    try {
        const comments = await recipeModel.getCommentsForRecipe(id);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
};

const addCommentToRecipe = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const newComment = await recipeModel.addCommentToRecipe(id, {
            user_id: userId,
            comment: req.body.comment
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

const addReplyToComment = async (req, res) => {
    const userId = req.user.id;
    const { commentId } = req.params;
    try {
        const newReply = await recipeModel.addReplyToComment(commentId, {
            user_id: userId,
            reply: req.body.reply
        });
        res.status(201).json(newReply);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add reply' });
    }
};

const toggleLikeRecipe = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const like = await recipeModel.toggleLikeRecipe(id, userId);
        res.status(201).json(like);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'You have already liked this recipe.' });
        }
        res.status(500).json({ error: 'Failed to like recipe' });
    }
};

const toggleFavoriteRecipe = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const favorite = await recipeModel.toggleFavoriteRecipe(id, userId);
        res.status(201).json(favorite);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'You have already favorited this recipe.' });
        }
        res.status(500).json({ error: 'Failed to favorite recipe' });
    }
};

const getTagsForRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const tags = await recipeModel.getTagsForRecipe(id);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags' });
    }
};

const toggleTagForRecipe = async (req, res) => {
    const userId = req.user.id;
    const { id: recipeId } = req.params;
    const { tagId } = req.body;

    try {
        const toggleResult = await recipeModel.toggleTagForRecipe(recipeId, tagId);

        if (toggleResult.message === 'Tag removed from recipe') {
            res.status(200).json({ message: 'Tag removed from recipe' });
        } else {
            res.status(201).json({ message: 'Tag added to recipe', data: toggleResult });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle tag' });
    }
};

const getRecipesByTag = async (req, res) => {
    const { tagName } = req.params;

    try {
        const recipes = await recipeModel.getRecipesByTag(tagName);
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve recipes by tag' });
    }
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
    toggleLikeRecipe,
    toggleFavoriteRecipe,
    getTagsForRecipe,
    toggleTagForRecipe,
    getRecipesByTag
};