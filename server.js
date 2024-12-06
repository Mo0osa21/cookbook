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

app.use(express.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.use(morgan('dev'))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)

app.use(passUserToView)

app.use('/auth', authCtrl)
app.use(isSignedIn)
app.use('/recipes', recipesCtrl)
app.use('/ingredients', ingredientsCtrl)

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to mongoDB ${mongoose.connection.name}`)
})

app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user 
  })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
