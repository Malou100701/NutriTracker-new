const Inspector = require("../models/Inspector");
const asyncHandler = require("../middlewares/asyncHandler");



// Bruges til at inspicere en ingrediens baseret på et delvist navn - denne bruges i søgefeltet på siden
const inspectIngredientController = asyncHandler(async (req, res) => {
  // forespørgslen tager der fat i ingrendiens navnet
  let name = req.query.name;

  // Henter ingrediensobjektet fra databasen
  let ingredient = await Inspector.inspectIngredient(name);
  res.json(ingredient); 
});

module.exports.inspectIngredientController = inspectIngredientController;


// Bruges til at vise ernæringsdetaljer om en fødevare/ingrediens
const ingredientView = asyncHandler(async (req, res) => {
  //forespørgslen tager der fat i ingrendiens navnet
  let name = req.query.ingredient; 

  let ingredient = await Inspector.showIngredient(name);
  //console.log(ingredient); - Brugt til test

    // Visningen og sender ingrediensobjektet på siden. Dette trin er vigtigt for dynamisk sidegengivelse baseret på hentede data.
    res.render('pages/inspector', {ingredient: ingredient});
});

module.exports.ingredientView = ingredientView;


//Overordnet kommentarer: 
//Der bruges async for at kunne bruge await, som venter på at databasen svarer. Dette bruges for at undgå at databasen svarer for sent, og at programmet derfor ikke kan fortsætte.
//Module.exports = gør at andre filer i applikationen kan bruge funktionerne.
// req.query = bruges til at hente parametre fra forespørgslen