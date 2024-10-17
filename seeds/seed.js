const pool = require('../config/db');

const dropTables = `
DROP TABLE IF EXISTS article_comments, article_tag_relations, article_tags, articles,
recipe_replies, recipe_comments, recipe_likes, recipe_favorites, follows, recipe_tag_relations, recipe_tags, recipes, users CASCADE;
`;

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;

  const recipeFavoritesTable = `
    CREATE TABLE IF NOT EXISTS recipe_favorites (
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
    await pool.query(usersTable);
    await pool.query(recipesTable);
    await pool.query(recipeCommentsTable);
    await pool.query(recipeRepliesTable);
    await pool.query(recipeLikesTable);
    await pool.query(recipeFavoritesTable);
    await pool.query(recipeTagsTable);
    await pool.query(recipeTagRelationsTable);
    await pool.query(followsTable);
    await pool.query(articlesTable);
    await pool.query(articleTagsTable);
    await pool.query(articleTagRelationsTable);
    await pool.query(articleCommentsTable);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  }
};

const seedData = async () => {

  const clearTables = `
    TRUNCATE TABLE article_comments, article_tag_relations, article_tags, articles,
    recipe_replies, recipe_comments, recipe_likes, recipe_favorites, follows, recipe_tag_relations, recipes, users RESTART IDENTITY CASCADE;
  `;

  const insertUsers = `
  INSERT INTO users (username, email, password, profile_image, bio)
  VALUES 
    ('john_doe', 'john@example.com', 'hashed_password_1', 'https://example.com/images/john.jpg', 'Bio for John Doe'),
    ('jane_smith', 'jane@example.com', 'hashed_password_2', 'https://example.com/images/jane.jpg', 'Bio for Jane Smith');
`;

  const insertRecipes = `
  INSERT INTO recipes (user_id, title, ingredients, instructions, image_url)
  VALUES 
    ((SELECT id FROM users WHERE username = 'john_doe'), 'Spaghetti Carbonara', 'Spaghetti, Eggs, Parmesan, Bacon, Garlic', 
    'Boil spaghetti. In a separate pan, cook bacon until crispy. Toss cooked spaghetti with egg mixture and bacon.', 
    'https://example.com/images/spaghetti-carbonara.jpg'),
    
    ((SELECT id FROM users WHERE username = 'jane_smith'), 'Vegan Avocado Toast', 'Avocado, Bread, Olive oil, Lemon, Salt, Pepper', 
    'Toast bread slices. Mash avocado and season with lemon, salt, and pepper. Spread avocado mixture on toast and drizzle with olive oil.', 
    'https://example.com/images/avocado-toast.jpg');
`;

  const insertRecipeComments = `
  INSERT INTO recipe_comments (user_id, recipe_id, comment)
  VALUES 
    ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM recipes WHERE title = 'Vegan Avocado Toast'), 'This looks delicious!'),
    ((SELECT id FROM users WHERE username = 'jane_smith'), (SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara'), 'I will try this tonight!')
    RETURNING id;
`;

  const insertRecipeReplies = `
  INSERT INTO recipe_replies (user_id, comment_id, reply)
  VALUES 
    ((SELECT id FROM users WHERE username = 'john_doe'), 2, 'Let me know how it turns out!');
`;

  const insertRecipeLikes = `
  INSERT INTO recipe_likes (user_id, recipe_id)
  VALUES 
    ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM recipes WHERE title = 'Vegan Avocado Toast')),
    ((SELECT id FROM users WHERE username = 'jane_smith'), (SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara'));
`;

  const insertRecipeFavorites = `
  INSERT INTO recipe_favorites (user_id, recipe_id)
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

  const insertRecipeTags = `
  INSERT INTO recipe_tags (name)
  VALUES 
    ('Vegan'), ('Gluten-Free'), ('Low-Carb');
`;

  const insertRecipeTagRelations = `
  INSERT INTO recipe_tag_relations (recipe_id, tag_id)
  VALUES 
    ((SELECT id FROM recipes WHERE title = 'Vegan Avocado Toast'), (SELECT id FROM recipe_tags WHERE name = 'Vegan')),
    ((SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara'), (SELECT id FROM recipe_tags WHERE name = 'Low-Carb'));
`;

  // Insert articles data
  const insertArticles = `
  INSERT INTO articles (user_id, title, content)
  VALUES 
    ((SELECT id FROM users WHERE username = 'john_doe'), 'The Benefits of Whole Foods', 'Whole foods provide the nutrients your body needs...'),
    ((SELECT id FROM users WHERE username = 'jane_smith'), 'Transitioning from Processed to Whole Foods', 'It can be easy to move away from processed foods...');
`;

  const insertArticleTags = `
  INSERT INTO article_tags (name)
  VALUES 
    ('Nutrition'), ('Health'), ('Whole Foods');
`;

  const insertArticleTagRelations = `
  INSERT INTO article_tag_relations (article_id, tag_id)
  VALUES 
    ((SELECT id FROM articles WHERE title = 'The Benefits of Whole Foods'), (SELECT id FROM article_tags WHERE name = 'Whole Foods')),
    ((SELECT id FROM articles WHERE title = 'Transitioning from Processed to Whole Foods'), (SELECT id FROM article_tags WHERE name = 'Nutrition'));
`;

  const insertArticleComments = `
  INSERT INTO article_comments (user_id, article_id, comment)
  VALUES 
    ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM articles WHERE title = 'The Benefits of Whole Foods'), 'Very informative!'),
    ((SELECT id FROM users WHERE username = 'jane_smith'), (SELECT id FROM articles WHERE title = 'Transitioning from Processed to Whole Foods'), 'Great tips for making the switch!');
`;

  try {
    await pool.query(dropTables);
    console.log('Tables dropped successfully');
    await createTables();
    
    await pool.query(clearTables);
    await pool.query(insertUsers);
    await pool.query(insertRecipes);

    const comments = await pool.query(insertRecipeComments);
    console.log(comments.rows);


    await pool.query(insertRecipeReplies);
    await pool.query(insertRecipeLikes);
    await pool.query(insertRecipeFavorites);
    await pool.query(insertFollows);
    await pool.query(insertRecipeTags);
    await pool.query(insertRecipeTagRelations);
    await pool.query(insertArticles);          // Insert articles
    await pool.query(insertArticleTags);       // Insert article tags
    await pool.query(insertArticleTagRelations); // Insert article tag relations
    await pool.query(insertArticleComments);
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