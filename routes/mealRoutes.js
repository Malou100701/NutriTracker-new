const express = require("express");
const router = express.Router();
const {getTotalNutrient, createMeal, addAllMeals, deleteMeal} = require("../controllers/mealController");

// Route for creating a new meal
router.post('/', createMeal); //restful design for creating a meal
// Route for deleting a meal
router.delete('/:ID', deleteMeal); 

router.get('/', addAllMeals);

router.get('/:mealID/totalNutrient', getTotalNutrient);

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

