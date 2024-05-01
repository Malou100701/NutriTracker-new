const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

// Controller for user registration
const registerUser = asyncHandler(async (req, res, next) => {

    let user = new User(req.body.Username, req.body.Password, req.body.Email, req.body.Age, req.body.Weight, req.body.Gender);
    // let registerUser = user.registerUser();

    res.status(201).json({
      success: true,
      data: {
        message: registerUser.toString()
      }
    });
  });

const loginUser = asyncHandler(async (req, res) => {
    const { Username, Password } = req.body;
    const user = await User.getUserByUsername(Username);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Authentication failed, user not found.' });
    }

    const isMatch = await user.validatePassword(Password);
    if (isMatch) {
        req.session.user = { username: user.username }; // Store user details in session
        res.json({ success: true, message: 'Logged in successfully' });
    } else {
        res.status(401).json({ success: false, message: 'Authentication failed, wrong password.' });
    }
});


const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy(err => {
    if (err) {
        return res.status(500).json({ success: false, message: 'Failed to logout' });
    }
    res.json({ success: true, message: 'Logged out successfully' })
  });
});



module.exports = {
  registerUser,
  loginUser,
  logoutUser
}
// module.exports = registerUser, loginUser, logoutUser;
// module.exports = registerUser;
// module.exports = loginUser;