const express = require('express')
const router = express.Router()

const User = require('../models/user.js')
const Recipe = require('../models/recipe.js')
const Ingredient = require('../models/ingredient.js')

router.get('/', async (req, res) => {
  try {
    const populatedingredients = await Ingredient.find()
    res.render('ingredients/index.ejs', {
      ingredients: populatedingredients
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', async (req, res) => {
  res.render('ingredients/new.ejs')
})

router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id
    await Ingredient.create(req.body)
    res.redirect('/ingredients')
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.delete('/:ingredientId', async (req, res) => {
  const ingredient = await Ingredient.findById(req.params.ingredientId)
  await ingredient.deleteOne()
  res.redirect('/ingredients')
})

module.exports = router
