const pool = require('../config/db');

const createTables = async () => {
    const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    profile_image VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const recipesTable = `
    CREATE TABLE IF NOT EXISTS recipes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title varchar(255) NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const commentsTable = `
    CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const repliesTable = `
    CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const likesTable = `
    CREATE TABLE IF NOT EXISTS likes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const favoritesTable = `
    CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const followsTable = `
    CREATE TABLE IF NOT EXISTS follows (
    id SERIAL PRIMARY KEY,
    follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
    followed_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

    const categoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
    );
    `;

    const tagsTable = `
    CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
    );
    `;

    const recipeTagsTable = `
    CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, tag_id)
    );
    `;

    try {
        await pool.query(usersTable);
    await pool.query(recipesTable);
    await pool.query(commentsTable);
    await pool.query(repliesTable);
    await pool.query(likesTable);
    await pool.query(favoritesTable);
    await pool.query(followsTable);
    await pool.query(categoriesTable);
    await pool.query(tagsTable);
    await pool.query(recipeTagsTable);
        console.log('Tables created successfully');        
    } catch (error) {
        console.error('Error creating tables', error);
    }
};

const seedData = async () => {

    const clearTables = `
    TRUNCATE TABLE comments, replies, likes, favorites, follows, recipe_tags, recipes, users, categories, tags RESTART IDENTITY CASCADE;
  `;

    const insertUsers = `
    INSERT INTO users (username, email, password, profile_image, bio)
    VALUES 
      ('john_doe', 'john@example.com', 'hashed_password_1', 'https://example.com/images/john.jpg', 'Bio for John Doe'),
      ('jane_smith', 'jane@example.com', 'hashed_password_2', 'https://example.com/images/jane.jpg', 'Bio for Jane Smith');
  `;

  const insertRecipes = `
    INSERT INTO recipes (user_id, title, ingredients, instructions, category, image_url)
    VALUES 
      ((SELECT id FROM users WHERE username = 'john_doe'), 'Spaghetti Carbonara', 'Spaghetti, Eggs, Parmesan, Bacon, Garlic', 
      'Boil spaghetti. In a separate pan, cook bacon until crispy. Toss cooked spaghetti with egg mixture and bacon.', 
      'Dinner', 'https://example.com/images/spaghetti-carbonara.jpg'),
      
      ((SELECT id FROM users WHERE username = 'jane_smith'), 'Vegan Avocado Toast', 'Avocado, Bread, Olive oil, Lemon, Salt, Pepper', 
      'Toast bread slices. Mash avocado and season with lemon, salt, and pepper. Spread avocado mixture on toast and drizzle with olive oil.', 
      'Breakfast', 'https://example.com/images/avocado-toast.jpg');
  `;

  const insertComments = `
    INSERT INTO comments (user_id, recipe_id, comment)
    VALUES 
      ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM recipes WHERE title = 'Vegan Avocado Toast'), 'This looks delicious!'),
      ((SELECT id FROM users WHERE username = 'jane_smith'), (SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara'), 'I will try this tonight!');
  `;

  const insertReplies = `
    INSERT INTO replies (user_id, comment_id, reply)
    VALUES 
      ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM comments WHERE comment = 'I will try this tonight!'), 'Let me know how it turns out!');
  `;

  const insertLikes = `
    INSERT INTO likes (user_id, recipe_id)
    VALUES 
      ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM recipes WHERE title = 'Vegan Avocado Toast')),
      ((SELECT id FROM users WHERE username = 'jane_smith'), (SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara'));
  `;

  const insertFavorites = `
    INSERT INTO favorites (user_id, recipe_id)
    VALUES 
      ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara')),
      ((SELECT id FROM users WHERE username = 'jane_smith'), (SELECT id FROM recipes WHERE title = 'Vegan Avocado Toast'));
  `;

  const insertFollows = `
    INSERT INTO follows (follower_id, followed_id)
    VALUES 
      ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM users WHERE username = 'jane_smith')),
      ((SELECT id FROM users WHERE username = 'jane_smith'), (SELECT id FROM users WHERE username = 'john_doe'));
  `;

  const insertCategories = `
    INSERT INTO categories (name)
    VALUES 
      ('Breakfast'), ('Lunch'), ('Dinner');
  `;

  const insertTags = `
    INSERT INTO tags (name)
    VALUES 
      ('Vegan'), ('Gluten-Free'), ('Low-Carb');
  `;

  const insertRecipeTags = `
    INSERT INTO recipe_tags (recipe_id, tag_id)
    VALUES 
      ((SELECT id FROM recipes WHERE title = 'Vegan Avocado Toast'), (SELECT id FROM tags WHERE name = 'Vegan')),
      ((SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara'), (SELECT id FROM tags WHERE name = 'Low-Carb'));
  `;

  try {
    await pool.query(clearTables);
    await pool.query(insertUsers);
    await pool.query(insertRecipes);
    await pool.query(insertComments);
    await pool.query(insertReplies);
    await pool.query(insertLikes);
    await pool.query(insertFavorites);
    await pool.query(insertFollows);
    await pool.query(insertCategories);
    await pool.query(insertTags);
    await pool.query(insertRecipeTags);
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data', error);
  }
};

const runSeed = async () => {
    await createTables();
    await seedData();
    pool.end();
};

runSeed();