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

//app.get('/login', (req, res) => res.render('pages/login'));
/*app. get('/login', function (req, res) {
	res.redirect('/user/login');
});*/

app.get('/register', (req, res) => res.render('pages/register'));
app.get('/profile', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('pages/profile', { user: req.session.user });
});
app.get('/inspector', (req, res) => res.render('pages/inspector'));
app.get('/mealCreator', (req, res) => res.render('pages/mealCreator'));
//app.get('/allMeals', (req, res) => res.render('pages/allMeals'));

//Listening on the port
const port = 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  /*

// use res.render to load up an ejs view file
// index page
app.get('/', function(req, res) {
  if (req.session.user) {
    res.render('pages/index', { user: req.session.user });
  } else {
    res.render('pages/index', { user: null });
  }
});

// log ind - page
app.get('/login', function(req, res) {
  res.render('pages/login');
});

// Opret profil - page
app.get('/register', function(req, res) {
  res.render('pages/register');
});

// profile for logged in
app.get('/profile', function(req, res) {

    if (!req.session.user) {
      return res.redirect('/login');  // Redirect to login if not logged in
  }
  const user = req.session.user;
  console.log("User data:", user); // Log the user data
    res.render('pages/profile', { user });
});

// Foodinspector page
app.get('/inspector', function(req, res) {
  if (!req.session.user) {
    return res.redirect('/login');  // Redirect to login if not logged in
} 
  res.render('pages/inspector');
});

// create a meal (route) - this is a route for http get request so it will be shown on the mealCreator page
app.get('/mealCreator', function(req, res) {
  res.render('pages/mealCreator'); //here it will use the mealCreator.ejs file, where the html is written
});

// Henter den url der hedder localhost:3000/allMeals, og render allMeals.ejs filen
app.get('/allMeals', function(req, res) {
  res.render('pages/allMeals'); 
});
*/
