const express = require('express');
const dotenv = require('dotenv');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/recipes', recipeRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});