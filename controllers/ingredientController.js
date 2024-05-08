const Ingredient = require("../models/Ingredient");
const asyncHandler = require("../middlewares/asyncHandler");
const { VarChar } = require("mssql");

const searchIngredient = asyncHandler(async (req, res, next) => {  
    let name = req.query.name;
    const result = await Ingredient.searchByName(name);
    // console.log('executed searchingredient', result); - Brugt til test
    //res.status(200).json({ success: true, data: result });
    res.json(result);
    
});

module.exports.searchIngredient = searchIngredient;