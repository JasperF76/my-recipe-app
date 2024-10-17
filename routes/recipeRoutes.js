const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeControllers');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/adminMiddleware');

router.get('/recipes', recipeController.getAllRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);
router.post('/recipes', authenticateUser, recipeController.createRecipe);
router.put('/recipes/:id', authenticateUser, authorizeAdmin, recipeController.updateRecipe);
router.delete('/recipes/:id', authenticateUser, authorizeAdmin, recipeController.deleteRecipe);
router.get('/recipes/:id/comments', recipeController.getCommentsForRecipe);
router.post('/recipes/:id/comments', authenticateUser, recipeController.addCommentToRecipe);
router.post('/recipes/comments/:commentId/replies', authenticateUser, recipeController.addReplyToComment);
router.post('/recipes/:id/like', authenticateUser, recipeController.likeRecipe);
router.post('/recipes/:id/favorite', authenticateUser, recipeController.favoriteRecipe);
router.get('/users/:userId/favorites', authenticateUser, recipeController.getFavoritesByUser);
router.get('/recipes/:id/tags', recipeController.getTagsForRecipe);
router.post('/recipes/:id/tags', authenticateUser, recipeController.addTagToRecipe);

module.exports = router;