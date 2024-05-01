const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");



router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.delete('/delete/:username', userController.deleteUser);
router.put('/update/:username', userController.updateUser);
// router.post('/changeUserDetails', userController.changeUserDetails);



module.exports = router;