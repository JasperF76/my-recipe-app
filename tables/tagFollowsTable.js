const pool = require('../config/db');

const createTagFollowsTable = async () => {
    const tagFollowsTable = `
    CREATE TABLE IF NOT EXISTS tag_follows (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES article_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, tag_id)
    )
    `;

    try {
        await pool.query(tagFollowsTable);
        console.log('Tag Follows table created successfully');
    } catch (error) {
        console.error('Error creating tag_follows table:', error);
    }
};

module.exports = { createTagFollowsTable };