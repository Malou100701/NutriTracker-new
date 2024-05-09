const express = require("express");
const router = express.Router();
const { inspectIngredientController, ingredientView } = require("../controllers/inspectorController");

router.get('/search', inspectIngredientController);

router.get('/ingredientView', ingredientView)

router.get('/inspector', (req, res) => res.render('pages/inspector'));

module.exports = router;

// Path: controllers/inspectorController.js