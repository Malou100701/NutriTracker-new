const express = require("express"); // Importere express
const router = express.Router(); // Opretter en router
const activityController = require("../controllers/activityController"); // Importere controlleren

router.post('/logActivity', activityController.logActivity); // Opretter en post route til at logge en aktivitet
router.get('/getActivities', activityController.getActivities); // Opretter en get route til at hente alle aktiviteter, med henblik på at vise dem i en dropdown menu

module.exports = router;