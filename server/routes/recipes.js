const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Recipe = require('../models/Recipe');

// POST /api/recipes
router.post('/', auth, async (req, res) => {
    const { title, description, ingredients, instructions } = req.body;

    try {
        const newRecipe = new Recipe({
            user: req.user.id,
            title,
            description,
            ingredients,
            instructions
        });

        const recipe = await newRecipe.save();
        res.json(recipe);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/recipes
router.get('/', async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ date: -1 });
        res.json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
