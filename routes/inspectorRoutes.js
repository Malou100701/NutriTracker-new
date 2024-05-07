const express = require("express");
const router = express.Router();
const inspectIngredient = require("../controllers/inspectorController");

router.get('/:Name', inspectIngredient);

router.get ('/inspector', (req, res) => res.render('pages/inspector'));

module.exports = router;

// Path: controllers/inspectorController.js