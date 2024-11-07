const pool = require('../config/db');

const createRecipeTables = async () => {
  const recipesTable = `
    CREATE TABLE IF NOT EXISTS recipes (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const recipeCommentsTable = `
    CREATE TABLE IF NOT EXISTS recipe_comments (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const recipeRepliesTable = `
    CREATE TABLE IF NOT EXISTS recipe_replies (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      comment_id INTEGER REFERENCES recipe_comments(id) ON DELETE CASCADE,
      reply TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const recipeLikesTable = `
    CREATE TABLE IF NOT EXISTS recipe_likes (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_like UNIQUE (user_id, recipe_id)
    );
  `;

  const recipeFavoritesTable = `
    CREATE TABLE IF NOT EXISTS recipe_favorites (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_favorite UNIQUE (user_id, recipe_id)
    );
  `;

  const recipeTagsTable = `
    CREATE TABLE IF NOT EXISTS recipe_tags (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
  `;

  const recipeTagRelationsTable = `
    CREATE TABLE IF NOT EXISTS recipe_tag_relations (
      recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
      tag_id INTEGER REFERENCES recipe_tags(id) ON DELETE CASCADE,
      PRIMARY KEY (recipe_id, tag_id)
    );
  `;

  try {
    await pool.query(recipesTable);
    await pool.query(recipeCommentsTable);
    await pool.query(recipeRepliesTable);
    await pool.query(recipeLikesTable);
    await pool.query(recipeFavoritesTable);
    await pool.query(recipeTagsTable);
    await pool.query(recipeTagRelationsTable);
    console.log('Recipe-related tables created successfully');
  } catch (error) {
    console.error('Error creating recipe-related tables:', error);
  }
};

module.exports = { createRecipeTables };