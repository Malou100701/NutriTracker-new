const express = require("express"); // Importere express
const router = express.Router(); // Opretter en router
const userController = require("../controllers/userController"); // Importere controlleren

router.post('/register', userController.registerUser); // Opretter en post route til at registrere en bruger
router.post('/login', userController.loginUser); // Opretter en post route til at logge en bruger ind
router.post('/logout', userController.logoutUser); // Opretter en post route til at logge en bruger ud

// Disse herunder er post methods, da vi benytter middleware _method som laver disse requests om til delete og put. Dette sker i profile.ejs
router.post('/delete', userController.deleteUser);
router.post('/update', userController.updateUser);

router.get('/profile/BMR', userController.BMR); // Opretter en get route til at hente BMR

router.get('/login', (req, res) => res.render('pages/login')); // Opretter en get route til at hente login siden
router.get('/register', (req, res) => res.render('pages/register')); // Opretter en get route til at hente register siden

module.exports = router;