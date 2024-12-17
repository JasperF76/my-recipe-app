const pool = require('../config/db');

const createUserTables = async () => {
  const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      profile_image VARCHAR(255),
      bio TEXT,
      is_admin BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const followsTable = `
    CREATE TABLE IF NOT EXISTS follows (
      id SERIAL PRIMARY KEY,
      follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
      followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_follow UNIQUE (follower_id, followed_id)
    )
  `;

  try {
    await pool.query(usersTable);
    await pool.query(followsTable);
    console.log('User-related tables created successfully');
  } catch (error) {
    console.error('Error creating user-related tables:', error);
  }
};

module.exports = { createUserTables };