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
    const { id } = req.params;
    try {
        const updatedRecipe = await recipeModel.updateRecipe(id, req.body, userId);
        if (!updatedRecipe) {
            return res.status(403).json({ error: 'Not authorized to update this recipe' });
        }
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update recipe' });
    }
};

const deleteRecipe = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const deleted = await recipeModel.deleteRecipe(id, userId);
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

const likeRecipe = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const like = await recipeModel.likeRecipe(id, userId);
        res.status(201).json(like);
    } catch (error) {
        res.status(500).json({ error: 'Failed to like recipe' });
    }
};

const favoriteRecipe = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const favorite = await recipeModel.favoriteRecipe(id, userId);
        res.status(201).json(favorite);
    } catch (error) {
        res.status(500).json({ error: 'Failed to favorite recipe' });
    }
};

const getFavoritesByUser = async (req, res) => {
    const userId = req.user.id;
    try {
        const favorites = await recipeModel.getFavoritesByUser(userId);
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve favorites' });
    }
};

const getTagsForRecipe = async (req, res) => {
    const { id } = req.params;
    try {
        const tags = await recipeModel.getTagsForRecipe(id);
        res.statuus(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags' });
    }
};

const addTagToRecipe = async (req, res) => {
    const userId = req.user.id;
    const { id, tagId } = req.params;
    try {
        const newTag = await recipeModel.addTagToRecipe(id, tagId);
        res.satus(201).json(newTag);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add tag' });
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
    likeRecipe,
    favoriteRecipe,
    getFavoritesByUser,
    getTagsForRecipe,
    addTagToRecipe
};