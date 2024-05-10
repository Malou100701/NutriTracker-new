const sql = require('mssql'); // Importere mssql
const config = require('../config'); // Importere config filen
const bcrypt = require('bcrypt') // Importere bcrypt, som bruges til at hashe passwords

// Funktionen registerUser tager imod parametrene username, password, email, age
async function registerUser(username, password, email, age, weight, gender, res) {
    if (!username || !password) { // Hvis username eller password ikke er udfyldt
        return res.status(400).send('Username and password are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hasher passwordet
    await sql.connect(config); // Forbinder til databasen
    // Indsætter brugeren i databasen, med hashed password
    await sql.query`
        INSERT INTO Users (Username, Password, Email, Age, Weight, Gender)
        VALUES (${username}, ${hashedPassword}, ${email}, ${age}, ${weight}, ${gender})`;
    return 'User registered successfully!';
}
module.exports.registerUser = registerUser;

// Funktionen getUserByUsername tager imod et username som parameter. Den bruges i login processen
async function getUserByUsername(username) {
    await sql.connect(config); // Forbinder til databasen
    // Henter brugeren fra databasen, hvis brugeren findes
    const result = await sql.query`SELECT * FROM Users WHERE Username = ${username}`;
    if (result.recordset.length > 0) { // Hvis brugeren findes
        const user = result.recordset[0];
        console.log("User found:", user);
        return {
            id: user.UserID,
            username: user.Username,
            password: user.Password,
            email: user.Email,
            age: user.Age,
            weight: user.Weight,
            gender: user.Gender
        };
    }
    return null;
}
module.exports.getUserByUsername = getUserByUsername;

// Funktionen validatePassword tager imod et password og et hashed password, og sammenligner dem, bruges også i login processen
async function validatePassword(userPassword, password) {
    const match = await bcrypt.compare(password, userPassword); // Sammenligner de to passwords
    return match; // Returnerer om de er ens eller ej
}
module.exports.validatePassword = validatePassword;

// Funktionen deleteUserByUserID tager imod et userID som parameter, og sletter brugeren fra databasen
async function deleteUserByUserID(userID) {
    await sql.connect(config); // Forbinder til databasen
    // Sletter brugeren fra databasen
    const result = await sql.query`DELETE FROM Users WHERE UserID = ${userID}`;
    if (result.rowsAffected[0] > 0) { // Hvis brugeren er slettet
        return true;
    }
    return false;
}
module.exports.deleteUserByUserID = deleteUserByUserID;

// Funktionen updateUserDetails tager imod et userID og nye detaljer som parameter, og opdaterer brugerens detaljer i databasen
async function updateUserDetails(userID, newDetails) {
    const { Age, Weight, Gender } = newDetails; // lav en variabel for hver af de nye detaljer
    await sql.connect(config); // Forbinder til databasen
    // Opdaterer brugerens detaljer i databasen
    const result = await sql.query`
        UPDATE Users SET Age = ${Age}, Weight = ${Weight}, Gender = ${Gender}
        WHERE UserID = ${userID}`;
    if (result.rowsAffected[0] > 0) { // Hvis brugerens detaljer er opdateret
        return true;
    }
    return false;
}
module.exports.updateUserDetails = updateUserDetails;

// Funktionen BMR tager imod et userID som parameter, og udregner brugerens basalstofskifte (Basal Metabolic Rate), bruges både i profilen og i kalorieberegningerne
async function BMR(UserID) {
    await sql.connect(config); // Forbinder til databasen
    // Henter brugerens detaljer fra databasen, og udregner BMR ud fra disse. Den sørger for at lave den korrekte forme for udregning, baseret på brugerens alder og køn
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    const query = `SELECT
    Gender,
    Age,
    Weight,
    CASE
        WHEN Gender = 'Kvinde' THEN
            CASE
                WHEN Age < 3 THEN 0.244 * Weight - 0.13
                WHEN Age BETWEEN 4 AND 10 THEN 0.085 * Weight + 2.03
                WHEN Age BETWEEN 11 AND 18 THEN 0.056 * Weight + 2.90
                WHEN Age BETWEEN 19 AND 30 THEN 0.0615 * Weight + 2.08
                WHEN Age BETWEEN 31 AND 60 THEN 0.0364 * Weight + 3.47
                WHEN Age BETWEEN 61 AND 75 THEN 0.0386 * Weight + 2.88
                WHEN Age > 75 THEN 0.0410 * Weight + 2.61
            END
        WHEN Gender = 'Mand' THEN
            CASE
                WHEN Age < 3 THEN 0.249 * Weight - 0.13
                WHEN Age BETWEEN 4 AND 10 THEN 0.095 * Weight + 2.11
                WHEN Age BETWEEN 11 AND 18 THEN 0.074 * Weight + 2.75
                WHEN Age BETWEEN 19 AND 30 THEN 0.064 * Weight + 2.84
                WHEN Age BETWEEN 31 AND 60 THEN 0.0485 * Weight + 3.67
                WHEN Age BETWEEN 61 AND 75 THEN 0.0499 * Weight + 2.93
                WHEN Age > 75 THEN 0.035 * Weight + 3.43
            END
    END AS BMR
FROM
    Users
    WHERE UserID = @UserID
    ;`;
    // Returnerer BMR
    const result = await request.query(query);
    const kCal = result.recordset[0].BMR * 238.8458966275; // Omregner BMR til kCal
    return kCal
}

module.exports.BMR = BMR;
