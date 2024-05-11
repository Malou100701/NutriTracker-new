// Import af Ingredient model og asyncHandler middleware
const Ingredient = require("../models/Ingredient");
const asyncHandler = require("../middlewares/asyncHandler");

// Funktion til at søge efter ingredienser baseret på navn
const searchIngredient = asyncHandler(async (req, res, next) => {  
    // Henter ingrediensnavnet fra forespørgslen
    let name = req.query.name;

    // Søger efter ingredienser baseret på navnet
    const result = await Ingredient.searchByName(name);
    // console.log('executed searchingredient', result); - Brugt til test
    
    // Sender resultatet som JSON-svar
    res.json(result);
    
});

// Eksporterer funktionen til brug andre steder i applikationen
module.exports.searchIngredient = searchIngredient;
