const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for user registration
const registerUser = asyncHandler(async (req, res, next) => {
    
    let user = new User(req.body.Username, req.body.Password);
    let registerUser = user.registerUser();



    res.status(201).json({
      success: true,
      data: {
        message: registerUser.toString()
      }
    });
  });

module.exports = registerUser;
