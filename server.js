const express = require('express')
const morgan = require('morgan')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const session = require('express-session')
const passUserToView = require('./middleware/pass-user-to-view.js')
const methodOverride = require('method-override')
const authCtrl = require('./controllers/auth')
const recipesCtrl = require('./controllers/recipes.js')
const ingredientsCtrl = require('./controllers/ingredients.js')
const isSignedIn = require('./middleware/is-signed-in.js')

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }))

// For overriding HTTP methods (e.g., PUT, DELETE)
app.use(methodOverride('_method'))

// Logging middleware
app.use(morgan('dev'))

// Setting up sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

// Custom middleware to pass user to the view
app.use(passUserToView)

// Auth controller routes
app.use('/auth', authCtrl)
app.use(isSignedIn)
app.use('/recipes', recipesCtrl)
app.use('/ingredients', ingredientsCtrl)

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to mongoDB ${mongoose.connection.name}`)
})

// Home route
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user // Pass user from session to view
  })
})

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
