const express = require("express");
const router = express.Router();
const registerUser = require("../controllers/userController");

router.post('/register', registerUser);
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