const express = require("express");
const router = express.Router();
const {editMeal, getTotalNutrient, createMeal, addAllMeals, deleteMeal} = require("../controllers/mealController");

// Route for creating a new meal
router.post('/', createMeal); //restful design for creating a meal

// Route for viewing a meal
router.get('/:ID/edit', editMeal);

// Route for deleting a meal
router.delete('/:ID', deleteMeal); 

router.get('/', addAllMeals);

router.get('/:mealID/totalNutrient', getTotalNutrient);

router.get ('/mealCreator', (req, res) => res.render('pages/mealCreator'));

/*
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/generate-access-token', generateAccessToken);
router.post("/change-password", verifyUserToken, verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), changePassword);
router.post("/forget-password", forgetPassword);
router.post("/reset-password/:token", resetPassword);
router.delete("/:id", verifyUserRoles(ROLES_LIST.ADMIN, ROLES_LIST.USER), softDeleteUser);
*/

module.exports = router;

