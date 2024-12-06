const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const Ingredient = require('../models/ingredient.js')
const Recipe = require('../models/recipe.js')

router.get('/', async (req, res) => {
  try {
    const populatedRecipes = await Recipe.find()
    res.render('recipes/index.ejs', {
      recipes: populatedRecipes
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  const ingredients = await Ingredient.find()
  res.render('recipes/new.ejs', {
    ingredients: ingredients
  })
})

router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id

    const ingredients = req.body['ingredients[]']
    req.body.ingredients = Array.isArray(ingredients)
      ? ingredients
      : [ingredients]

    delete req.body['ingredients[]']

    const newRecipe = await Recipe.create(req.body)
    console.log('Recipe Created:', newRecipe)

    res.redirect('/recipes')
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/:recipeId', async (req, res) => {
  try {
    const populatedRecipes = await Recipe.findById(
      req.params.recipeId
    ).populate('owner').populate("ingredients")

    res.render('recipes/show.ejs', {
      recipe: populatedRecipes
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/:recipeId/edit', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId)
    const ingredients = await Ingredient.find()
    res.render('recipes/edit.ejs', {
      recipe: currentRecipe,
      ingredients: ingredients
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:recipeId', async (req, res) => {
  try {
    const currentRecipe = await Recipe.findById(req.params.recipeId);

    if (currentRecipe.owner.equals(req.session.user._id)) {
      const updatedIngredients = req.body['ingredients[]']; 
      req.body.ingredients = Array.isArray(updatedIngredients)
        ? updatedIngredients
        : [updatedIngredients]; 
      delete req.body['ingredients[]']; 

      await currentRecipe.updateOne(req.body);
      res.redirect('/recipes');
    } else {
      res.send("You don't have permission to edit this recipe.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});


router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
    if (recipe.owner.equals(req.session.user._id)) {
      await Recipe.deleteOne()
      res.redirect('/recipes')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (error) {
    console.error(error)
    res.redirect('/')
  }
})
module.exports = router
