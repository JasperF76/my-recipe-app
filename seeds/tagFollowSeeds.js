const seedTagFollows = async () => {
    const insertTagFollows = `
    INSERT INTO tag_follows (user_id, tag_id)
    VALUES
        ((SELECT id FROM users WHERE username = 'john_doe'),
        (SELECT id FROM article_tags WHERE name = 'Whole Foods')),
        ((SELECT id FROM users WHERE username = 'jane_smith'),
        (SELECT id FROM article_tags WHERE name = 'Nutrition'));
    `;
    return { insertTagFollows };
};

module.exports = { seedTagFollows };