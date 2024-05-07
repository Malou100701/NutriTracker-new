const Activity = require("../models/Activity");
const asyncHandler = require("../middlewares/asyncHandler");



const logActivity = asyncHandler(async (req, res) => {
  console.log('Session user:', req.session.user); // Log session user
  const userID = req.session.user.userID;
  const { activityTypeID, duration, dateTime } = req.body;

  await Activity.logActivity(userID, activityTypeID, duration, dateTime);
  console.log('Activity logged');
//   await loggedActivity.logActivity(username);
res.redirect('/activitytracker');
 
});


// Kan muligvis slettes
const getActivities = asyncHandler(async (req, res) => {
    console.log("Endpoint hit");
    const activities = await Activity.getActivities();
    console.log('Activities:', { activities });
    res.render('pages/activitytracker', { activities });
});




module.exports = {
    logActivity,
    getActivities
  }