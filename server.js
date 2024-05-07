//Creating express server
const express = require("express");
const app = express();
const sql = require('mssql');
const session = require('express-session');
require('dotenv').config();
const methodOverride = require('method-override');


// Database and configurations 
const config = require('./config');

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json
app.use(express.static('public'));
app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' } //You need to use a secure cookie in production with HTTPS
}));

app.use(methodOverride('_method'));

// set the view engine to ejs
app.set('view engine', 'ejs');

//Routes for the different pages
const indexRoutes = require("./routes/indexRoutes");
app.use("/", indexRoutes);

// Basic route definitions - consider moving these to appropriate route files if they grow
app.get('/', (req, res) => {
  res.render('pages/index', { user: req.session.user || null });
});

app.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('pages/profile', { user: req.session.user });
});

// Dette er lidt en 'hacker' løsning, funktionen burde køres i controllers, men efter 3,5 timer uden held, så er det her vi er nu
const Activity = require('./models/Activity');
app.get('/activitytracker', async (req, res) => {
  const activities = await Activity.getActivities();
  res.render('pages/activitytracker', { user: req.session.user, activities: activities });
});

const MealTracker = require('./models/MealTracker');
app.get('/mealtracker', async (req, res) => {
  const UserID = req.session.user.userID;
  const meals = await MealTracker.getMeals(UserID);
  console.log('Meals:', { meals });
  res.render('pages/mealTracker', { user: req.session.user, meals: meals });
});


//Listening on the port
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });


