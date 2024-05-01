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
        res.json({ success: true, message: `${Username} logged in successfully` });
    } else {
        res.status(401).json({ success: false, message: 'Authentication failed, wrong password.' });
    }
});


const logoutUser = asyncHandler(async (req, res) => {
  const { Username } = req.body;
  req.session.destroy(err => {
    if (err) {
        return res.status(500).json({ success: false, message: 'Failed to logout' });
    }
    res.json({ success: true, message: `${Username} logged out successfully` })
  });
});

//Lige nu kan alle delete alles user ved deres username /user/delete/:username uden at være logget ind
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params; // Assuming username is passed as a URL parameter
    const deleted = await User.deleteUserByUsername(username);
    if (deleted) {
        res.status(200).json({ success: true, message: "User deleted successfully." });
    } else {
        res.status(404).json({ success: false, message: "User not found." });
    }
} catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user." });
}
});


const updateUser = asyncHandler(async (req, res) => {
    try {
      const { username } = req.params; // Assuming username is passed as a URL parameter
      const newDetails = req.body; // Assuming new details are passed in the request body
      const updated = await User.updateUserDetails(username, newDetails);
      if (updated) {
        res.status(200).json({ success: true, message: "User details updated successfully." });
    } else {
        res.status(404).json({ success: false, message: "User not found." });
    }
  }  catch (error) {
    res.status(500).json({ success: false, message: "Error updating user details." });
  }
});


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser
}
// module.exports = registerUser, loginUser, logoutUser;
// module.exports = registerUser;
// module.exports = loginUser;