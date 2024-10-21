const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/adminMiddleware');

router.get('/recipes', recipeController.getAllRecipes); // General route
router.get('/recipes/:id', recipeController.getRecipeById); // Specific ID route

// Comments and Replies
router.get('/recipes/:id/comments', recipeController.getCommentsForRecipe); // Get comments for a specific recipe
router.post('/recipes/:id/comments', authenticateUser, recipeController.addCommentToRecipe); // Add a comment to a recipe
router.post('/recipes/comments/:commentId/replies', authenticateUser, recipeController.addReplyToComment); // Add reply to a comment

// Likes and Favorites
router.post('/recipes/:id/like', authenticateUser, recipeController.likeRecipe); // Like a recipe
router.post('/recipes/:id/favorite', authenticateUser, recipeController.favoriteRecipe); // Favorite a recipe
router.get('/users/:userId/favorites', authenticateUser, recipeController.getFavoritesByUser); // Get a user's favorite recipes

// Tags
router.get('/recipes/:id/tags', recipeController.getTagsForRecipe); // Get tags for a recipe
router.post('/recipes/:id/tags', authenticateUser, recipeController.addTagToRecipe); // Add tags to a recipe

// Admin actions (these should stay at the bottom for clarity and security)
router.post('/recipes', authenticateUser, recipeController.createRecipe); // Create a recipe
router.put('/recipes/:id', authenticateUser, authorizeAdmin, recipeController.updateRecipe); // Admin update
router.delete('/recipes/:id', authenticateUser, authorizeAdmin, recipeController.deleteRecipe); // Admin delete

module.exports = router;