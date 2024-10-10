const pool = require('..config/db');

exports.getAllRecipes = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM recipes');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recipes' });
    }
};

exports.createRecipe = async (req, res) => {
    const {title, ingredients, instructions} = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO recipes (title, ingredients, instructions) VALUES ($1, $2, $3) RETURNING *',
            [title, ingredients, instructions]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error creating recipe' });
    }
};