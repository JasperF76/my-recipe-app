const express = require('express');
const router = express.Router();
const userController = require('../controllers/userControllers');
const authenticateUser = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/users/:userId/follow', authenticateUser, userController.followUser);

module.exports = router;