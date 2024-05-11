const express = require("express");
const router = express.Router();
const { inspectIngredientController, ingredientView } = require("../controllers/inspectorController");


// Anvender 'inspectIngredientController' til at håndtere forespørgslen.
router.get('/search', inspectIngredientController);

// Bruger 'ingredientView' controlleren til at hente detaljeret information om en specifik ingrediens
router.get('/ingredientView', ingredientView);

// Præsenterer direkte 'inspector' viewet uden at sende nogen specifik ingrediensinformation.
// Det betyder, at når siden bliver loadet, så vil der ikke være nogen ingrediens vist.
router.get('/', (req, res) => res.render('pages/inspector', {ingredient: null}));

module.exports = router;


//Overordnet kommentarer: 
//Module.exports = gør at andre filer i applikationen kan bruge funktionerne.

