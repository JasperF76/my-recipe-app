const pool = require('../config/db');

const getAllArticles = async () => {
    const result = await pool.query('SELECT * FROM articles');
    return result.rows;
};

const getArticleById = async (articleId) => {
    const result = await pool.query('SELECT * FROM articles WHERE id = $1', [articleId]);
    return result.rows[0];
};

const createArticle = async (articleData) => {
    const { title, content, user_id } = articleData;
    const result = await pool.query(
        'INSERT INTO articles (title, content, user_id) VALUES ($1, $2, $3) RETURNING *',
        [title, content, user_id]
    );
    return result.rows[0];
};

const updateArticle = async (articleId, articleData, userId = null) => {
    const { title, content } = articleData;

    let query;
    let values;

    if (userId) {
        query = `
            UPDATE articles
            SET title = $1, content = $2, updated_at = NOW()
            WHERE id = $3 AND user_id = $4 RETURNING *
        `;
        values = [title, content, articleId, userId];
    } else {
        query = `
            UPDATE articles
            SET title = $1, content = $2, updated_at = NOW()
            WHERE id = $3 RETURNING *
        `;
        values = [title, content, articleId];
    }

    const result = await pool.query(query, values);
    return result.rows[0];
};


const deleteArticle = async (articleId, userId = null) => {
    let query;
    let values;

    if (userId) {
        query = 'DELETE FROM articles WHERE id = $1 AND user_id = $2 RETURNING *';
        values = [articleId, userId];
    } else {
        query = 'DELETE FROM articles WHERE id = $1 RETURNING *';
        values = [articleId];
    }

    const result = await pool.query(query, values);
    return result.rowCount > 0;
};


const getCommentsForArticle = async (articleId) => {
    const result = await pool.query('SELECT * FROM article_comments WHERE article_id = $1', [articleId]);
    return result.rows;
};

const addCommentToArticle = async (articleId, commentData) => {
    const { user_id, comment } = commentData;
    const result = await pool.query(
        'INSERT INTO article_comments (user_id, article_id, comment) VALUES ($1, $2, $3) RETURNING *',
        [user_id, articleId, comment]
    );
    return result.rows[0];
};

const getTagsForArticle = async (articleId) => {
    const result = await pool.query(
        'SELECT t.name FROM article_tags t INNER JOIN article_tag_relations atr ON t.id = atr.tag_id WHERE atr.article_id = $1',
        [articleId]
    );
    return result.rows;
};

const toggleTagForArticle = async (articleId, tagId) => {
    const checkRelation = await pool.query(
        'SELECT * FROM article_tag_relations WHERE article_id = $1 AND tag_id =$2',
        [articleId, tagId]
    );

    if (checkRelation.rows.length > 0) {
        await pool.query(
            'DELETE FROM article_tag_relations WHERE article_id = $1 AND tag_id = $2 RETURNING *',
            [articleId, tagId]
        );
        return 'Tag removed from article';
    } else {
        const result = await pool.query(
            'INSERT INTO article_tag_relations (article_id, tag_id) VALUES ($1, $2) RETURNING *',
            [articleId, tagId]
        );
        return result.rows[0];
    }
};

const getArticlesByTag = async (tagName) => {
    const result = await pool.query(
        `
        SELECT a.*
        FROM articles a
        INNER JOIN article_tag_relations atr ON a.id = atr.article_id
        INNER JOIN article_tags t ON atr.tag_id = t.id
        WHERE t.name ILIKE $1
        `,
        [tagName]
    );
    return result.rows;
};

module.exports = {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getCommentsForArticle,
    addCommentToArticle,
    getTagsForArticle,
    toggleTagForArticle,
    getArticlesByTag
};