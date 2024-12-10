const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers');
const authenticateUser = require('../middleware/authMiddleware');
// const authorizeAdmin = require('../middleware/adminMiddleware');

router.get('/recipes', recipeController.getAllRecipes); // General route
router.get('/recipes/:id', recipeController.getRecipeById); // Specific ID route

// Comments and Replies
router.get('/recipes/:id/comments', recipeController.getCommentsForRecipe); // Get comments for a specific recipe
router.post('/recipes/:id/comments', authenticateUser, recipeController.addCommentToRecipe); // Add a comment to a recipe
router.post('/recipes/comments/:commentId/replies', authenticateUser, recipeController.addReplyToComment); // Add reply to a comment

// Likes and Favorites
router.post('/recipes/:id/like', authenticateUser, recipeController.toggleLikeRecipe); // Like a recipe
router.post('/recipes/:id/favorite', authenticateUser, recipeController.toggleFavoriteRecipe); // Favorite a recipe

// Tags
router.get('/recipes/:id/tags', recipeController.getTagsForRecipe); // Get tags for a recipe
router.post('/recipes/:id/tags', authenticateUser, recipeController.toggleTagForRecipe); // Add tags to a recipe
router.get('/recipes/tags/:tagName', recipeController.getRecipesByTag);

// User Actions
router.post('/recipes', authenticateUser, recipeController.createRecipe); // Create a recipe

// The logic behind these routes allows admin access to their functions.
router.put('/recipes/:id', authenticateUser, recipeController.updateRecipe);
router.delete('/recipes/:id', authenticateUser, recipeController.deleteRecipe);

module.exports = router;