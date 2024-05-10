const sql = require('mssql'); // Vi har tilføjet mssql her, da vi skal bruge det til at forbinde til vores database
const config = require('../config'); // Vi har tilføjet config her, da vi skal bruge det til at forbinde til vores database
const moment = require('moment-timezone'); // Vi har tilføjet moment her, da vi skal bruge det til at justere tiden, så den passer med vores tidzone

// Denne funktion logger en aktivitet i databasen
async function logActivity(userID, activityTypeID, duration, dateTime) {

    await sql.connect(config); // Vi forbinder til databasen

    //Denne kode tilføjer 2 timer til det indsatte DateTime, da serveren ikke befinder sig det samme sted som os, og der derfor er tidsforskel på 2 timer. 
    //Det vil sige, vi kan lave en post request til kl 13:00:00, hvilket normal vil blive til kl. 11 i vores database. Derfor adderer vi med to i vores backend, som indsætter det korrekte i databasen, smart ik?
    //Dog krævede dette at vi installerede npm moment, og requirede den i denne model
    const adjustedDatetime = moment.utc(dateTime).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

    const request = new sql.Request(); // Vi opretter en ny request
    // Vi indsætter vores parametre i requesten nedenfor
    request.input('UserID', sql.Int, userID);
    request.input('ActivityTypeID', sql.Int, activityTypeID);
    request.input('Duration', sql.Decimal, duration);
    request.input('DateTime', sql.DateTime, adjustedDatetime);

    // Vi udfører vores query, som indsætter vores data i databasen
    const result = await request.query(`
            INSERT INTO UserActivity (UserID, ActivityTypeID, Duration, DateTime)
            VALUES (@UserID, @ActivityTypeID, @Duration, @DateTime)
        `);
}

module.exports.logActivity = logActivity;

// Denne funktion henter alle aktiviteter fra databasen, med henblik på at kunne vise dem i en dropdown menu på vores frontend
async function getActivities() {

    await sql.connect(config); // Vi forbinder til databasen
    // Vi opretter en ny request, der skal hente ID og navn på alle aktiviteter fra databasen
    const query = `SELECT ActivityTypeID, ActivityName 
        FROM ActivityType 
`;
    // Vi udfører vores query, og returnerer resultatet
    const result = await sql.query(query);
    return result.recordset;
}

module.exports.getActivities = getActivities;