// Importerer express-modulet og opretter en router ved hjælp af express.Router().
const express = require("express");
const router = express.Router();

// Importerer inspectIngredientController og ingredientView-funktionerne fra inspectorController-modulet.
const { inspectIngredientController, ingredientView } = require("../controllers/inspectorController");

// Definerer en GET-rute '/search', der bruger inspectIngredientController-funktionen som controller.
router.get('/search', inspectIngredientController);

// Definerer en GET-rute '/ingredientView', der bruger ingredientView-funktionen som controller.
router.get('/ingredientView', ingredientView);

// Definerer en GET-rute '/', der sender et renderet HTML-svar med siden 'inspector' og ingrediens som null.
router.get('/', (req, res) => res.render('pages/inspector', {ingredient: null}));

// Eksporterer routeren, så den kan bruges af andre moduler.
module.exports = router;
