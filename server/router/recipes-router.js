const express = require('express');
const Recipe = require("../models/Recipe");
const router = express.Router();

// Routes

router.get('/recipes', async (req, res) => {
    console.log("Recipe browse page");
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (err) {
        res.status(500).send("Error fetching recipes from the database");
    }
});
router.post('/recipes/new', async (req, res) => {
    console.log("Request Body Received:", req.body); 

    const { name, description, difficulty, ingredients, steps } = req.body;

    if (!name || !description || !difficulty || !ingredients || !steps) {
        return res.status(400).send("All fields are required."); 
    }

    try {
        const newRecipe = new Recipe({
            name,
            description,
            difficulty,
            ingredients,
            steps,
        });
        const savedRecipe = await newRecipe.save();
        res.status(201).json(savedRecipe);
    } catch (err) {
        console.error("Error saving recipe:", err); // Log the exact error
        res.status(400).send("Error saving the recipe");
    }
});


router.get('/recipes/:id', async (req, res) => {
    console.log("Recipe detail page");
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).send("Recipe not found");
        }
        res.json(recipe);
    } catch (err) {
        res.status(500).send("Error fetching recipe with ID: " + req.params.id);
    }
});

router.put('/recipes/:id', async (req, res) => {
    console.log("Edit recipe page");
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!recipe) {
            return res.status(404).send("Recipe not found");
        }
        res.json(recipe);
    } catch (err) {
        res.status(500).send("Error updating recipe with ID: " + req.params.id);
    }
});

router.delete('/recipes/:id', async (req, res) => {
    console.log("Deleting recipe page");
    try {
        const result = await Recipe.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (err) {
        res.status(500).send("Error deleting recipe with ID: " + req.params.id);
    }
});

module.exports = router;
