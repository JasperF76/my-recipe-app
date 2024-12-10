const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authenticateUser = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/users/:userId/follow', authenticateUser, userController.followUser);
router.get('/users/:userId/favorites', authenticateUser, userController.getFavoritesByUser); // Get a user's favorite recipes
router.get('/users', authenticateUser, userController.getAllUsers);

module.exports = router;