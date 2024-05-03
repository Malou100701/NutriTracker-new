const Inspector = require("../models/Inspector");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for user registration
const inspectIngredient = asyncHandler(async (req, res, next) => {
  console.log("Endpoint hit with Name:", req.params.Name); // Log immediately on hitting the endpoint

  const loggedInUser = req.session.user;
    if (!loggedInUser) {
        return res.status(401).json({ success: false, message: "Unauthorized. You must be logged in to update details." });
    }
    let Name = new Inspector(req.params.Name);
    let inspectIngredient = await Name.inspectIngredient();

    console.log("Ingredient Data:", inspectIngredient); // Log data received from the database


    res.status(200).json({
      success: true,
      data: inspectIngredient
    });
  });

module.exports = inspectIngredient;