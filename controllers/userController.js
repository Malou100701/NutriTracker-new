const User = require("../models/User"); // Importerer modellen
const asyncHandler = require("../middlewares/asyncHandler"); // Importerer middleware

// Controller til at registrere en bruger
const registerUser = asyncHandler(async (req, res) => {
    const { Username, Password, Email, Age, Weight, Gender } = req.body; // Henter data fra request body
    if (await User.registerUser(Username, Password, Email, Age, Weight, Gender)) { // Kalder funktionen registerUser fra modellen
        res.redirect('/login'); // Redirect til login siden, hvis alt lykkedes
    } else { // Hvad der skal ske, hvis det ikke lykkedes
        res.status(400).json({
            success: false,
            message: "Failed to register user"
        });
    }
});

// Controller til at logge en bruger ind
const loginUser = asyncHandler(async (req, res) => {
    const { Username, Password } = req.body; // Henter data fra request body
    const user = await User.getUserByUsername(Username); // Kalder funktionen getUserByUsername fra modellen

    if (!user) { // Hvis brugeren ikke findes
        return res.status(401).json({ success: false, message: 'Authentication failed, user not found.' });
    }

    if (await User.validatePassword(user.password, Password)) { // Hvis passwordet er korrekt
        req.session.user = { username: user.username, userID: user.id }; // Gemmer brugeren i session
        res.redirect('/'); // Redirect til forsiden
    } else { // Hvad der skal ske, hvis passwordet er forkert
        res.status(401).json({ success: false, message: 'Authentication failed, wrong password.' });
    }
});

// Controller til at logge en bruger ud
const logoutUser = asyncHandler(async (req, res) => {
    req.session.destroy(err => { // Sletter sessionen
        if (err) { // Hvad der skal ske, hvis det ikke lykkedes
            return res.status(500).json({ success: false, message: 'Failed to logout' });
        }
        res.redirect('/'); // Redirect til forsiden
    });
});

// Controller til at slette en bruger
const deleteUser = asyncHandler(async (req, res) => {
    if (!req.session.user) { // Hvis brugeren ikke er logget ind
        return res.status(401).json({ success: false, message: "Unauthorized. You must be logged in to delete an account." });
    }

    if (await User.deleteUserByUserID(req.session.user.userID)) { // Hvis det lykkedes at slette brugeren
        req.session.destroy(() => { // Sletter sessionen
            res.redirect('/'); // Redirect til forsiden
        });
    } else { // Hvad der skal ske, hvis det ikke lykkedes
        res.status(404).json({ success: false, message: "User not found." });
    }
});

// Controller til at opdatere en bruger
const updateUser = asyncHandler(async (req, res) => {
    if (!req.session.user) { // Hvis brugeren ikke er logget ind
        return res.status(401).json({ success: false, message: "Unauthorized. You must be logged in to update details." });
    }

    const { Age, Weight, Gender } = req.body; // Henter data fra request body
    if (await User.updateUserDetails(req.session.user.userID, { Age, Weight, Gender })) { // Kalder funktionen updateUserDetails fra modellen
        res.redirect('/profile'); // Redirect til profilsiden, hvis det lykkedes, så siden opdatere
    } else {
        res.status(404).json({ success: false, message: "User not found." });
    }
});

// Controller til at hente BMR
const BMR = asyncHandler(async (req, res) => {
    const UserID = req.session.user.userID; // Henter brugerens ID fra session
    const BMR = await User.BMR(UserID); // Henter BMR fra modellen
    res.render('pages/profile', { BMR: BMR }); // Sender BMR til viewet
});


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    deleteUser,
    updateUser,
    BMR
};