const Activity = require("../models/Activity"); // Importerer modellen
const asyncHandler = require("../middlewares/asyncHandler"); // Importerer middleware


// Controller til at logge en aktivitet
const logActivity = asyncHandler(async (req, res) => {
  const userID = req.session.user.userID; // Henter brugerens ID fra session
  const { activityTypeID, duration, dateTime } = req.body; // Henter data fra request body

  await Activity.logActivity(userID, activityTypeID, duration, dateTime); // Kalder funktionen logActivity fra modellen
  res.redirect('/activitytracker');
});


// Controller til at hente alle aktiviteter, med henblik på at vise dem i viewets dropdown menu
const getActivities = asyncHandler(async (req, res) => {
  const activities = await Activity.getActivities(); // Kalder funktionen getActivities fra modellen
  res.render('pages/activitytracker', { activities }); // Sender aktiviteterne til viewet
});


module.exports = {
  logActivity,
  getActivities
}