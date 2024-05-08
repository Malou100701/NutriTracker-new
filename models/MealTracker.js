const sql = require('mssql');
const config = require('../config');
const moment = require('moment-timezone');






async function trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude) {
    const adjustedDatetime = moment.utc(DateTime).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
    console.log('adustedDatetime:', adjustedDatetime);
    // console.log('Meal logged:', { UserID, MealID, adjustedDatetime, Amount, latitude, longitude });

    await sql.connect(config);
    await sql.query`
        INSERT INTO Intake (UserID, MealID, DateTime, Amount, Location)
        VALUES (${UserID}, ${MealID}, ${adjustedDatetime}, ${Amount}, ${latitude + ',' + longitude})`;
    console.log('Meal tracked successfully!');
    
}

module.exports.trackMeal = trackMeal;

async function renderMeals(UserID) {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    const query = `SELECT M.ID, M.Name, I.DateTime, I.Amount, I.IntakeID
                   FROM Meal M
                   JOIN Intake I ON M.ID = I.MealID
                   WHERE I.UserID = @UserID`;
    const result = await request.query(query);
    return result.recordset;
}

module.exports.renderMeals = renderMeals;


async function updateMeal(UserID, IntakeID, DateTime, Amount){
    await sql.connect(config);
    console.log('UserID', UserID, 'IntakeID:', IntakeID, 'DateTime:', DateTime, 'Amount:', Amount);

    
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    request.input('IntakeID', sql.Int, IntakeID);
    request.input('DateTime', sql.DateTime, DateTime);
    request.input('Amount', sql.Int, Amount);

    const result = await request.query(`
        UPDATE Intake
        SET DateTime = @DateTime, Amount = @Amount
        WHERE IntakeID = @IntakeID AND UserID = @UserID;
    `);

        console.log(result.rowsAffected[0] + ' row(s) updated');
    return result.rowsAffected[0]; // Returns the number of affected rows
}

module.exports.updateMeal = updateMeal;


async function getMeals(UserID) {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('UserID', sql.Int, UserID);
        const query = `SELECT ID, Name
                       FROM Meal 
                       WHERE UserID = @UserID`;
        const result = await request.query(query);
        return result.recordset;
}

module.exports.getMeals = getMeals;