const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for user registration
const registerUser = asyncHandler(async (req, res, next) => {
  console.log(req.body.Username, req.body.Password)
  console.log(req.body)
    let user = new User(req.body.Username, req.body.Password, req.body.Email, req.body.Age, req.body.Weight, req.body.Gender);
    let registerUser = user.registerUser();



    res.status(201).json({
      success: true,
      data: {
        message: registerUser.toString()
      }
    });
  });

module.exports = registerUser;
