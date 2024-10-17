const pool = require('../config/db');

const createArticleTables = async () => {
  const articlesTable = `
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const articleTagsTable = `
    CREATE TABLE IF NOT EXISTS article_tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  const articleTagRelationsTable = `
    CREATE TABLE IF NOT EXISTS article_tag_relations (
      article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES article_tags(id) ON DELETE CASCADE,
      PRIMARY KEY (article_id, tag_id)
    );
  `;

  const articleCommentsTable = `
    CREATE TABLE IF NOT EXISTS article_comments (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(articlesTable);
    await pool.query(articleTagsTable);
    await pool.query(articleTagRelationsTable);
    await pool.query(articleCommentsTable);
    console.log('Article-related tables created successfully');
  } catch (error) {
    console.error('Error creating article-related tables:', error);
  }
};

module.exports = { createArticleTables };