const Inspector = require("../models/Inspector");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for user registration
const inspectIngredientController = asyncHandler(async (req, res, next) => {
  let name = req.query.name;
  const result = await Inspector.inspectIngredient(name);
  res.json(result); 
});
module.exports.inspectIngredientController = inspectIngredientController;

const ingredientView = asyncHandler(async (req, res, next) => {
let ingredientName = req.query.ingredient;
let ingredient = await Inspector.showIngredient(ingredientName);
console.log(ingredient);
res.render('pages/inspector', {ingredient: ingredient});
});
module.exports.ingredientView = ingredientView;