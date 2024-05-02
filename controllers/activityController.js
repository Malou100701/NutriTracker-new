const Activity = require("../models/Activity");
const asyncHandler = require("../middlewares/asyncHandler");

/*
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        const user = req.session.user.UserID;
    } else {
        res.status(401).send("Unauthorized");
    }
}
*/

const logActivity = asyncHandler(async (req, res) => {
  console.log('Session user:', req.session.user); // Log session user
  const username = req.session.user.username;

  let loggedActivity = new Activity(req.body.ActivityTypeID, req.body.Duration, req.body.DateTime);
  await loggedActivity.logActivity(username);

  res.status(201).json({
      success: true,
      data: {
          message: 'Activity logged successfully'
      }
  });
});





module.exports = {
    logActivity
  }