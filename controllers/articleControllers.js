const pool = require('../config/db');
const articleModel = require('../models/articleModel');

const getAllArticles = async (req, res) => {
    try {
        const articles = await articleModel.getAllArticles();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve articles' });
    }
};

const getArticleById = async (req, res) => {
    const { id } = req.params;
    try {
        const article = await articleModel.getArticleById(id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        return res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve article' });
    }
};

const searchArticles = async (req, res) => {
    const { query } = req.query;

    if (!query || query.trim() === '') {
        console.log('Search query is missing or empty for articles');
        return res.status(400).json({ error: 'Search query cannot be empty' });
    }

    try {
        console.log('Search query for articles:', query);
        const results = await articleModel.searchArticles(query);
        console.log('Search results for articles:', results);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No articles with that keyword found' });
        }

        res.status(200).json(results);
    } catch (error) {
        console.error('Error searching articles:', error);
        res.status(500).json({ error: 'Failed to retrieve articles' });
    }
};

const createArticle = async (req, res) => {
    const userId = req.user.id;
    try {
        const newArticle = await articleModel.createArticle({
            ...req.body,
            user_id: userId
        });
        res.status(201).json(newArticle);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create article' });
    }
};

const updateArticle = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const updatedArticle = await articleModel.updateArticle(id, req.body, userId);
        if (!updatedArticle) {
            return res.status(403).json({ error: 'Not authorized to update this article' });
        }
        res.status(200).json(updatedArticle);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update article' });
    }
};

const deleteArticle = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const deleted = await articleModel.deleteArticle(id, userId);
        if (!deleted) {
            return res.status(403).json({ error: 'Not authorized to delete this article' });
        }
        res.status(204).json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
};

const getCommentsForArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const comments = await articleModel.getCommentsForArticle(id);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve comments' });
    }
};

const addCommentToArticle = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    try {
        const newComment = await articleModel.addCommentToArticle(id, {
            user_id: userId,
            comment: req.body.comment
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

const getTagsForArticle = async (req, res) => {
    const { id } = req.params;
    try {
        const tags = await articleModel.getTagsForArticle(id);
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tags' });
    }
};

const toggleTagForArticle = async (req, res) => {
    const { id } = req.params;
    const { tagId } = req.body;

    try {
        const result = await articleModel.toggleTagForArticle(id, tagId);

        if (result === 'Tag removed from article') {
            return res.status(200).json({ message: result });
        }

        return res.status(201).json({ message: 'Tag added to article', tag: result });
    } catch (error) {
        console.error('Error toggling tag for article:', error);
        res.status(500).json({ error: 'Failed to toggle tag for article' });
    }
};

const getArticlesByTag = async (req, res) => {
    const { tagName } = req.params;
    try {
        const articles = await articleModel.getArticlesByTag(tagName);
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve articles' });
    }
};

module.exports = {
    getAllArticles,
    getArticleById,
    searchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    getCommentsForArticle,
    addCommentToArticle,
    getTagsForArticle,
    toggleTagForArticle,
    getArticlesByTag
};