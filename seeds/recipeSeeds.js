const seedRecipes = async () => {
    const insertRecipes = `
      INSERT INTO recipes (user_id, title, description, ingredients, instructions, image_url)
      VALUES 
        ((SELECT id FROM users WHERE username = 'john_doe'), 'Spaghetti Carbonara', 'A classic Italian pasta dish', 'Spaghetti, Eggs, Parmesan, Bacon, Garlic', 
        'Boil spaghetti. In a separate pan, cook bacon until crispy. Toss cooked spaghetti with egg mixture and bacon.', 
        'https://example.com/images/spaghetti-carbonara.jpg'),
        
        ((SELECT id FROM users WHERE username = 'jane_smith'), 'Vegan Avocado Toast', 'A simple and delicious vegan breakfast', 'Avocado, Bread, Olive oil, Lemon, Salt, Pepper', 
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
  
    const insertRecipeTags = `
      INSERT INTO recipe_tags (name)
      VALUES ('Vegan'), ('Gluten-Free'), ('Low-Carb');
    `;
  
    const insertRecipeTagRelations = `
      INSERT INTO recipe_tag_relations (recipe_id, tag_id)
      VALUES 
        ((SELECT id FROM recipes WHERE title = 'Vegan Avocado Toast' LIMIT 1), (SELECT id FROM recipe_tags WHERE name = 'Vegan' LIMIT 1)),
        ((SELECT id FROM recipes WHERE title = 'Spaghetti Carbonara' LIMIT 1), (SELECT id FROM recipe_tags WHERE name = 'Low-Carb' LIMIT 1));
    `;
  
    return {
      insertRecipes,
      insertRecipeComments,
      insertRecipeReplies,
      insertRecipeLikes,
      insertRecipeFavorites,
      insertRecipeTags,
      insertRecipeTagRelations
    };
  };
  
  module.exports = { seedRecipes };