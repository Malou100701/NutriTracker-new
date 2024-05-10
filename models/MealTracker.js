const sql = require('mssql'); // Vi importerer mssql modulet, som vi bruger til at forbinde til vores SQL server
const config = require('../config'); // Vi importerer vores config fil, som indeholder vores database forbindelsesinformationer
const moment = require('moment-timezone'); // Vi importerer moment modulet, som vi bruger til at justere tiden, så den passer med vores tidzone

// Denne funktion logger en aktivitet i databasen
async function trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude) {

    const adjustedDatetime = moment.utc(DateTime).add(0, 'hours').format('YYYY-MM-DD HH:mm:ss'); // Fungere som en konvertering af 'DateTime' parameteren til et format, som SQL serveren kan forstå

    await sql.connect(config); // Vi forbinder til databasen
    // Vi udfører vores query, som indsætter vores data i databasen
    await sql.query`
        INSERT INTO Intake (UserID, MealID, DateTime, Amount, Location)
        VALUES (${UserID}, ${MealID}, ${adjustedDatetime}, ${Amount}, ${latitude + ',' + longitude})`;
}

module.exports.trackMeal = trackMeal;


// Denne funktion henter alle indtagede måltider fra databasen, med henblik på at kunne vise dem i en tabel på vores frontend
async function renderMeals(UserID) {
    await sql.connect(config); // Vi forbinder til databasen

    // Vi opretter en ny request, der skal hente alle indtagede måltider fra databasen, og tager UserID som parameter
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);

    // Dette er en SQL-forespørgsel, der henter og sorterer oplysninger om fødeindtag for en bestemt bruger fra Intake, Meal og Ingredient tabellerne,
    // baseret på brugerens ID og tidspunktet for indtaget. Resultatet returneres i faldende rækkefølge efter DateTime.
    const query = `
        SELECT I.IntakeID, M.Name as MealName, Ing.Name as IngredientName, I.DateTime, I.Amount
        FROM Intake I
        LEFT JOIN Meal M ON I.MealID = M.ID
        LEFT JOIN Ingredient Ing ON I.IngredientID = Ing.IngredientID
        WHERE I.UserID = @UserID
        ORDER BY I.DateTime DESC;`;
    // Vi udfører vores query, og returnerer resultatet
    const result = await request.query(query);
    return result.recordset;
}
module.exports.renderMeals = renderMeals;


// Denne funktion opdaterer et måltid i databasen
async function updateMeal(UserID, IntakeID, DateTime, Amount, MealID = null, IngredientID = null) {
    await sql.connect(config); // Vi forbinder til databasen
    const adjustedDatetime = moment.utc(DateTime).add(4, 'hours').format('YYYY-MM-DD HH:mm:ss'); // Fungere som en konvertering af 'DateTime' parameteren til et format, som SQL serveren kan forstå.
    //Vi har ikke kunne finde ud af, hvorfor vi skal tilføje 4 timer, frem for 2 timer, som vi ellers har gjort i andre modeller.

    // Vi opretter en ny request, der skal opdatere et måltid i databasen
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    request.input('IntakeID', sql.Int, IntakeID);
    request.input('DateTime', sql.DateTime, adjustedDatetime);
    request.input('Amount', sql.Int, Amount);

    // Da MealID og IngredientID er valgfrie parametre, tjekker vi om de er blevet sendt med, og tilføjer dem til requesten, hvis de er blevet det.
    if (MealID !== null) {
        request.input('MealID', sql.Int, MealID);
    }
    if (IngredientID !== null) {
        request.input('IngredientID', sql.Int, IngredientID);
    }

    // console.log('Updating meal with:', { UserID, IntakeID, adjustedDatetime, Amount, MealID, IngredientID });  // Brugt til fejlsøgning, da det var en udfordring at finde ud af, hvorfor vores updateMeal ikke virkede.
    // Dette er en SQL-forespørgsel, der opdaterer et måltid i databasen baseret på brugerens ID, måltidets ID og ingrediensens ID, hvis de er blevet sendt med.
    let updateQuery = `
        UPDATE Intake
        SET DateTime = @DateTime, Amount = @Amount
        WHERE IntakeID = @IntakeID AND UserID = @UserID`;

    if (MealID !== null) {
        updateQuery += ' AND MealID = @MealID'; // Add condition for MealID
    }
    if (IngredientID !== null) {
        updateQuery += ' AND IngredientID = @IngredientID'; // Add condition for IngredientID
    }

    // Vi udfører vores query, og returnerer resultatet
    const result = await request.query(updateQuery);
    return result.rowsAffected[0]; // Returns the number of affected rows
}
module.exports.updateMeal = updateMeal;

// Denne funktion sletter et måltid fra Intake i databasen
async function deleteMeal(IntakeID) {
    await sql.connect(config); // Vi forbinder til databasen

    // Vi opretter en ny request, der skal slette et måltid fra databasen
    const request = new sql.Request();
    request.input('IntakeID', sql.Int, IntakeID);
    const result = await request.query(`
            DELETE FROM Intake
            WHERE IntakeID = @IntakeID;
        `);
    return result.rowsAffected[0];
}

module.exports.deleteMeal = deleteMeal;

// Denne funktion tracker vandindtag i databasen
async function trackWater(UserID, DateTime, Amount, latitude, longitude) {
    const adjustedDatetime = moment.utc(DateTime).add(0, 'hours').format('YYYY-MM-DD HH:mm:ss'); // Fungere som en konvertering af 'DateTime' parameteren til et format, som SQL serveren kan forstå.

    await sql.connect(config); // Vi forbinder til databasen

    // Vi udfører vores query, som indsætter vores data i databasen, vi tager 45 som fast IngredientID, da det er vand.
    await sql.query`
        INSERT INTO Intake (UserID, IngredientID, DateTime, Amount, Location)
        VALUES (${UserID}, 45, ${adjustedDatetime}, ${Amount}, ${latitude + ',' + longitude})`;
}
module.exports.trackWater = trackWater;

// Denne funktion tracker ingrediensindtag i databasen
async function trackIngredient(UserID, IngredientID, DateTime, Amount, latitude, longitude) {
    const adjustedDatetime = moment.utc(DateTime).add(0, 'hours').format('YYYY-MM-DD HH:mm:ss'); // Fungere som en konvertering af 'DateTime' parameteren til et format, som SQL serveren kan forstå.

    await sql.connect(config); // Vi forbinder til databasen

    // Vi udfører vores query, som indsætter vores data i databasen
    await sql.query`
        INSERT INTO Intake (UserID, IngredientID, DateTime, Amount, Location)
        VALUES (${UserID}, ${IngredientID}, ${adjustedDatetime}, ${Amount}, ${latitude + ',' + longitude})`;
}
module.exports.trackIngredient = trackIngredient;


// Denne funktion henter alle måltider fra databasen, med henblik på at kunne vise dem i en dropdown menu på vores frontend
async function getMeals(UserID) {
    await sql.connect(config); // Vi forbinder til databasen

    // Vi opretter en ny request, der skal hente ID og navn på alle måltider fra databasen
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    const query = `SELECT ID, Name
                       FROM Meal 
                       WHERE UserID = @UserID`;

    // Vi udfører vores query, og returnerer resultatet               
    const result = await request.query(query);
    return result.recordset;
}
module.exports.getMeals = getMeals;