const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);

//Disse herunder er post methods, da vi benytter middleware _method som laver disse requests om til delete og put. Dette sker i profile.ejs
router.post('/delete', userController.deleteUser);
router.post('/update', userController.updateUser);
// router.post('/changeUserDetails', userController.changeUserDetails);

// router.get('/profile', userController.viewProfile)

router.get ('/login', (req, res) => res.render('pages/login'));
router.get ('/register', (req, res) => res.render('pages/register'));




module.exports = router;