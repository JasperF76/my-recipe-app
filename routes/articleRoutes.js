const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleControllers');
const authenticateUser = require('../middleware/authMiddleware');
const authorizeAdmin = require('../middleware/adminMiddleware');

router.get('/articles', articleController.getAllArticles);
router.get('/articles/search', articleController.searchArticles);
router.get('/articles/:id', articleController.getArticleById);
router.post('/articles', authenticateUser, authorizeAdmin, articleController.createArticle);
router.put('/articles/:id', authenticateUser, authorizeAdmin, articleController.updateArticle);
router.delete('/articles/:id', authenticateUser, authorizeAdmin, articleController.deleteArticle);
router.get('/articles/:id/comments', articleController.getCommentsForArticle);
router.post('/articles/:id/comments', authenticateUser, articleController.addCommentToArticle);
router.get('/articles/:id/tags', articleController.getTagsForArticle);
router.post('/articles/:id/tags', authenticateUser, authorizeAdmin, articleController.toggleTagForArticle);
router.get('/articles/tags/:tagName', articleController.getArticlesByTag);

module.exports = router;