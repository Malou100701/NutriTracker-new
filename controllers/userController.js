const User = require("../models/User");
const asyncHandler = require("../middlewares/asyncHandler");

const registerUser = asyncHandler(async (req, res) => {
  const { Username, Password, Email, Age, Weight, Gender } = req.body;
  if (await User.registerUser(Username, Password, Email, Age, Weight, Gender)) {
      res.redirect('/login');
  } else {
      res.status(400).json({
          success: false,
          message: "Failed to register user"
      });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { Username, Password } = req.body;
  const user = await User.getUserByUsername(Username);

  if (!user) {
      return res.status(401).json({ success: false, message: 'Authentication failed, user not found.' });
  }

  if (await User.validatePassword(user.password, Password)) {
      req.session.user = { username: user.username, userID: user.id };
      res.redirect('/');
  } else {
      res.status(401).json({ success: false, message: 'Authentication failed, wrong password.' });
  }
});


const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return res.status(500).json({ success: false, message: 'Failed to logout' });
      }
      res.redirect('/');
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. You must be logged in to delete an account." });
  }

  if (await User.deleteUserByUserID(req.session.user.userID)) {
      req.session.destroy(() => {
          res.redirect('/');
      });
  } else {
      res.status(404).json({ success: false, message: "User not found." });
  }
});

const updateUser = asyncHandler(async (req, res) => {
  if (!req.session.user) {
      return res.status(401).json({ success: false, message: "Unauthorized. You must be logged in to update details." });
  }

  const { Age, Weight, Gender } = req.body;
  if (await User.updateUserDetails(req.session.user.user, { Age, Weight, Gender })) {
      res.redirect('/profile');
  } else {
      res.status(404).json({ success: false, message: "User not found." });
  }
});


const BMR = asyncHandler(async (req, res) => {
  const UserID = req.session.user.userID;
  const BMR = await User.BMR(UserID);
  console.log("User BMR:", BMR);
  res.render('pages/profile', { BMR: BMR });
  
});


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
  BMR
};