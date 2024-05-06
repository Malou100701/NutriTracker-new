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

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser
};

/*
// Controller for user registration
const registerUser = asyncHandler(async (req, res) => {

    let user = new User(req.body.Username, req.body.Password, req.body.Email, req.body.Age, req.body.Weight, req.body.Gender);
    let registerUser = user.registerUser();

  if(registerUser){
    res.redirect('/login');
  } else{
    res.status(401).json({
      success: false,
      data: {
        message: "failed to register user"
      }
    });
  }
    
    
  });

const loginUser = asyncHandler(async (req, res) => {
    const { Username, Password } = req.body;
    const user = await User.getUserByUsername(Username);
    console.log("Retrieved user data:", user); // Add this line to check the retrieved user data
    console.log(user);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Authentication failed, user not found.' });
    }

    const isMatch = await user.validatePassword(Password);
    if (isMatch) {
        req.session.user = { username: user.username, userID: user.userID }; // Store user details in session
        console.log("Session data after login:", req.session.user); // Add this line to check the session data
        // res.json({ success: true, message: `${Username} logged in successfully` });
        res.redirect('/');
    } else {
        res.status(401).json({ success: false, message: 'Authentication failed, wrong password.' });
    }
});


const logoutUser = asyncHandler(async (req, res) => {
  const { Username } = req.body;
  req.session.destroy(err => {
    if (err) {
        return res.status(500).json({ success: false, message: 'Failed to logout' });
    } else {
      res.redirect('/');  // Redirect or handle as needed
    }

  });
});

//Man skal være logged in for at kunne delete sin account, dette sørger if statement for
const deleteUser = asyncHandler(async (req, res) => {
  const loggedInUser = req.session.user; // Get the logged-in user from the session
    if (!loggedInUser) {
        return res.status(401).json({ success: false, message: "Unauthorized. You must be logged in to delete an account." });
    }

    // Use the username from the session to delete the user
    const deleted = await User.deleteUserByUsername(loggedInUser.username);
    if (deleted) {
        // Destroy the session after deleting the user
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Failed to logout after deleting user.' });
            }
            res.redirect('/');  // Redirect or handle as needed
        });
    } else {
        res.status(404).json({ success: false, message: "User not found." });
    }
});
  

//Man skal være logged in for at kunne update sin account, dette sørger if statement for
const updateUser = asyncHandler(async (req, res) => {
    const loggedInUser = req.session.user;
    if (!loggedInUser) {
        return res.status(401).json({ success: false, message: "Unauthorized. You must be logged in to update details." });
    }

    const { Age, Weight, Gender } = req.body;

    console.log("Request Data:", { Age, Weight, Gender });

    const newDetails = { Age, Weight, Gender };
    const updated = await User.updateUserDetails(loggedInUser.username, newDetails);
    console.log("Updated:", updated); // Add this line to check if the update was successful

    if (updated) {
      const updatedUser = await User.getUserByUsername(loggedInUser.username);
      console.log("Updated User:", updatedUser); // Add this line to check the updated user data

      res.render('pages/profile', { user: updatedUser });
    } else {
        res.status(404).json({ success: false, message: "User not found." });
    }
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  deleteUser,
  updateUser,
}
// module.exports = registerUser, loginUser, logoutUser;
// module.exports = registerUser;
// module.exports = loginUser;

*/