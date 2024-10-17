const seedArticles = async () => {
    const insertArticles = `
      INSERT INTO articles (user_id, title, content)
      VALUES 
        ((SELECT id FROM users WHERE username = 'john_doe'), 'The Benefits of Whole Foods', 'Whole foods provide the nutrients your body needs...'),
        ((SELECT id FROM users WHERE username = 'jane_smith'), 'Transitioning from Processed to Whole Foods', 'It can be easy to move away from processed foods...');
    `;
  
    const insertArticleTags = `
      INSERT INTO article_tags (name)
      VALUES ('Nutrition'), ('Health'), ('Whole Foods');
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
  
    return {
      insertArticles,
      insertArticleTags,
      insertArticleTagRelations,
      insertArticleComments
    };
  };
  
  module.exports = { seedArticles };