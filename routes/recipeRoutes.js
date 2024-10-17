const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authenticateUser = require('../middleware/authMiddleware');

router.get('/recipes', recipeController.getAllRecipes);

router.post('/recipes', recipeController.createRecipe);

module.exports = router;