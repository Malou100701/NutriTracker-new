//Creating express server
const express = require("express"); // Importere express
const app = express(); // Opretter en express app
const sql = require('mssql'); // Importere mssql
const session = require('express-session'); // Importere express-session
require('dotenv').config(); // Importere dotenv
const methodOverride = require('method-override'); // Importere method-override

const config = require('./config'); // Importere config filen

// Middleware
app.use(express.urlencoded({ extended: true })); // For at parse form data
app.use(express.json()); // For at parse json data
app.use(express.static('public')); // For at kunne hente css filer i public mappen
app.use(session({
  secret: 'secret', // secret: 'secret' er en hemmelig nøgle, som bruges til at signere session cookien. Her ville man normalt bruge en lang og tilfældig streng, da det er mere sikkert.
  resave: false, // resave: false betyder at sessionen ikke gemmes, hvis der ikke er sket ændringer i den
  saveUninitialized: true, // saveUninitialized: true betyder at sessionen gemmes, selvom der ikke er nogen data i den
  cookie: { secure: 'auto' } // secure: 'auto' betyder at cookien kun sendes over https, hvis det er muligt
}));

app.use(methodOverride('_method')); // For at kunne bruge put og delete i formerne i vores views

app.set('view engine', 'ejs'); // For at kunne bruge ejs filer

//Routes for the different pages
const indexRoutes = require("./routes/indexRoutes");
app.use("/", indexRoutes);


// De nedenstående routes er ikke den korrekte måde at gøre dette på. De skal være delt ud i controller og i routes, men på trods af mange timers forsøg
// uden held, så har vi valgt at lave dem her, så vi har en fungerende version af vores applikation. Dette er også behandlet i vores rapport under proccesevaluering.
// Så vidt vi har kunne teste os frem til, skyldes det at objekterne der skal passes ind til vores views, ikke kan passes ind, når de er i controllers.
app.get('/', (req, res) => {
  res.render('pages/index', { user: req.session.user || null });
});

// getActivities kaldes også her, da det er den eneste måde vi har kunne få det til at virke på.
const Activity = require('./models/Activity');
app.get('/activitytracker', async (req, res) => {
  const activities = await Activity.getActivities();
  res.render('pages/activitytracker', { user: req.session.user, activities: activities });
});

// getMeals og renderMeals kaldes også her, da det er den eneste måde vi har kunne få det til at virke på.
const MealTracker = require('./models/MealTracker');
app.get('/mealtracker', async (req, res) => {
  const UserID = req.session.user.userID;
  const meals = await MealTracker.getMeals(UserID);
  const intakes = await MealTracker.renderMeals(UserID);
  res.render('pages/mealTracker', { user: req.session.user, meals: meals, intakes: intakes });
});

// BMR kaldes også her, da det er den eneste måde vi har kunne få det til at virke på.
const User = require('./models/User');
app.get('/profile', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const UserID = req.session.user.userID;
  const BMR = await User.BMR(UserID);
  console.log("User BMRServer:", BMR);
  res.render('pages/profile', { user: req.session.user, BMR });
});

// Start server
const port = 3000; // Portnummeret
app.listen(port, () => { // Lytter på porten
  console.log(`Listening on port ${port}`);
});

module.exports = app; // Eksporterer appen, så den kan bruges i test filerne