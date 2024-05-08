const express = require("express");
const router = express.Router();
const { searchIngredient } = require("../controllers/ingredientController");

router.get('/search', searchIngredient);

module.exports = router;