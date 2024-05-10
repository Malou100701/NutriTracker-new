const express = require("express"); // Importere express
const router = express.Router(); // Opretter en router
const mealTrackerController = require("../controllers/mealTrackerController"); // Importere controlleren

router.post('/trackMeal', mealTrackerController.trackMeal); // Opretter en post route til at logge en aktivitet
router.get('/', mealTrackerController.handleMeals); // Opretter en get route til at hente alle aktiviteter, med henblik på at vise dem i en dropdown menu, når siden loades


router.post('/water', mealTrackerController.trackWater); // Opretter en post route til at logge en aktivitet
router.post('/ingredient', mealTrackerController.trackIngredient); // Opretter en post route til at logge en aktivitet


//Disse herunder er post methods, da vi benytter middleware _method som laver disse requests om til delete og put. Dette sker i mealtracker.ejs
router.post('/update', mealTrackerController.updateMeal); // Opretter en post route til at opdatere et måltid i intake, denne ændres til put i viewet
router.post('/delete', mealTrackerController.deleteMeal); // Opretter en post route til at slette et måltid i intake, denne ændres til delete i viewet


module.exports = router; 
