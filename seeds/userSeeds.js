const bcrypt = require('bcrypt');

const seedUsers = async () => {
  const hashedPassword1 = await bcrypt.hash('password1', 10);
  const hashedPassword2 = await bcrypt.hash('password2', 10);

  const insertUsers = `
    INSERT INTO users (username, email, password, profile_image, bio, is_admin)
    VALUES 
      ('john_doe', 'john@example.com', '${hashedPassword1}', 'https://example.com/images/john.jpg', 'Bio for John Doe', true),
      ('jane_smith', 'jane@example.com', '${hashedPassword2}', 'https://example.com/images/jane.jpg', 'Bio for Jane Smith', false);
  `;

  const insertFollows = `
    INSERT INTO follows (follower_id, followed_id)
    VALUES 
      ((SELECT id FROM users WHERE username = 'john_doe'), (SELECT id FROM users WHERE username = 'jane_smith')),
      ((SELECT id FROM users WHERE username = 'jane_smith'), (SELECT id FROM users WHERE username = 'john_doe'));
  `;

  return { insertUsers, insertFollows };
};

module.exports = { seedUsers };