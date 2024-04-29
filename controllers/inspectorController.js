const Inspector = require("../models/Inspector");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for user registration
const inspectIngredient = asyncHandler(async (req, res, next) => {
    
    let Name = new Inspector(req.params.Name);
    let inspectIngredient = Name.inspectIngredient();


    res.status(201).json({
      success: true,
      data: {
        message: inspectIngredient.toString()
      }
    });
  });

module.exports = inspectIngredient;