// Import af Inspector model og asyncHandler middleware
const Inspector = require("../models/Inspector");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for at inspicere ingredienser
const inspectIngredientController = asyncHandler(async (req, res, next) => {
  // Henter ingrediensnavnet fra forespørgslen
  let name = req.query.name;

  // Inspekterer ingrediensen
  const result = await Inspector.inspectIngredient(name);

  //Sender resultatet som JSON-svar
  res.json(result); 
});
// Eksportere inspectIngredientController til brug i andre dele af applikationen
module.exports.inspectIngredientController = inspectIngredientController;



// Visning af ingredienssiden
const ingredientView = asyncHandler(async (req, res, next) => {
  //Henter ingrediensnavnet fra forespørgslen
  let ingredientName = req.query.ingredient;

  // Finder ingrediensen baseret på navnet
  let ingredient = await Inspector.showIngredient(ingredientName);
  //console.log(ingredient); - Brugt til test
  
  // Sender ingrediensen til visningsside
  res.render('pages/inspector', {ingredient: ingredient});
});

// Eksporterer ingredientView til brug i andre dele af applikationen.
module.exports.ingredientView = ingredientView;