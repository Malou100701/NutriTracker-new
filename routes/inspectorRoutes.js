const express = require("express");
const router = express.Router();
const { inspectIngredientController, ingredientView } = require("../controllers/inspectorController");

router.get('/search', inspectIngredientController);

router.get('/ingredientView', ingredientView);

router.get('/', (req, res) => res.render('pages/inspector', {ingredient: null}));

module.exports = router;

// Path: controllers/inspectorController.js