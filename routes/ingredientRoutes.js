// Importerer express-modulet og opretter en router ved hjælp af express.Router().
const express = require("express");
const router = express.Router();

// Importerer searchIngredient-funktionen fra ingredientController-modulet.
const { searchIngredient } = require("../controllers/ingredientController");

// Definerer en GET-rute '/search', der bruger searchIngredient-funktionen som controller.
router.get('/search', searchIngredient);

// Eksporterer routeren, så den kan bruges af andre moduler.
module.exports = router;