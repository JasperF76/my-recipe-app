const pool = require('../config/db');
const { seedUsers } = require('./userSeeds');
const { seedRecipes } = require('./recipeSeeds');
const { seedArticles } = require('./articleSeeds');

const { createUserTables } = require('../tables/userTables');
const { createRecipeTables } = require('../tables/recipeTables');
const { createArticleTables } = require('../tables/articleTables');

const dropTables = `
  DROP TABLE IF EXISTS article_comments, article_tag_relations, article_tags, articles,
  recipe_replies, recipe_comments, recipe_likes, recipe_favorites, follows, recipe_tag_relations, recipes, users CASCADE;
`;

const seedData = async () => {
  try {
    // Drop all tables
    await pool.query(dropTables);
    console.log('Tables dropped successfully');

    // Create all tables
    await createUserTables();
    await createRecipeTables();
    await createArticleTables();
    console.log('Tables created successfully');

    // Clear the tables before inserting seed data
    const clearTables = `
      TRUNCATE TABLE article_comments, article_tag_relations, article_tags, articles,
      recipe_replies, recipe_comments, recipe_likes, recipe_favorites, follows, recipe_tag_relations, recipes, users RESTART IDENTITY CASCADE;
    `;
    await pool.query(clearTables);

    // Seed users and follows
    const { insertUsers, insertFollows } = await seedUsers();
    await pool.query(insertUsers);
    await pool.query(insertFollows);
    console.log('Users and Follows seeded successfully');

    // Seed recipes and related data
    const {
      insertRecipes,
      insertRecipeComments,
      insertRecipeReplies,
      insertRecipeLikes,
      insertRecipeFavorites,
      insertRecipeTags,
      insertRecipeTagRelations
    } = await seedRecipes();
    await pool.query(insertRecipes);
    await pool.query(insertRecipeComments);
    await pool.query(insertRecipeReplies);
    await pool.query(insertRecipeLikes);
    await pool.query(insertRecipeFavorites);
    await pool.query(insertRecipeTags);
    await pool.query(insertRecipeTagRelations);
    console.log('Recipes and related data seeded successfully');

    // Seed articles and related data
    const {
      insertArticles,
      insertArticleTags,
      insertArticleTagRelations,
      insertArticleComments
    } = await seedArticles();
    await pool.query(insertArticles);
    await pool.query(insertArticleTags);
    await pool.query(insertArticleTagRelations);
    await pool.query(insertArticleComments);
    console.log('Articles and related data seeded successfully');

  } catch (error) {
    console.error('Error inserting seed data', error);
  } finally {
    pool.end();
  }
};

const runSeed = async () => {
  await seedData();
};

runSeed();