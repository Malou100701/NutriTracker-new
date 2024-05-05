//Creating express server
const express = require("express");
const app = express();
const sql = require('mssql');
const session = require('express-session');
require('dotenv').config();
const config = require('./config');
const methodOverride = require('method-override');


app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json
app.use(express.static('public'));

app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' } //You need to use a secure cookie in production with HTTPS
}));

const port = 3000;

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file
// index page
app.get('/', function(req, res) {
  if (req.session.user) {
    res.render('pages/index', { user: req.session.user });
  } else {
    res.render('pages/index', { user: null });
  }
});


// log ind page
app.get('/login', function(req, res) {
  res.render('pages/login');
});

// Opret profil page
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
  
  /*if (!req.session.user) {
    return res.redirect('/login');  // Redirect to login if not logged in
} */
  res.render('pages/inspector');
});

// Meal page
app.get('/', function(req, res) {
  res.render('pages/mealCreator');
});


//Routes
const indexRoutes = require("./routes/indexRoutes");
app.use("/", indexRoutes);

//Listening on the port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });