const express = require("express");
const router = express.Router();
const inspectIngredient = require("../controllers/inspectorController");

router.get('/:Name', inspectIngredient);

module.exports = router;

// Path: controllers/inspectorController.js