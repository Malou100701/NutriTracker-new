const sql = require('mssql');
const config = require('../config');
const moment = require('moment-timezone');






async function trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude) {
    const adjustedDatetime = moment.utc(DateTime).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');
    console.log('Meal logged:', { UserID, MealID, adjustedDatetime, Amount, latitude, longitude });

    await sql.connect(config);
    await sql.query`
        INSERT INTO Intake (UserID, MealID, DateTime, Amount, Location)
        VALUES (${UserID}, ${MealID}, ${adjustedDatetime}, ${Amount}, ${latitude + ',' + longitude})`;
    console.log('Meal tracked successfully!');
}

module.exports.trackMeal = trackMeal;




async function getMeals(UserID) {
    console.log('getMeals');
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('UserID', sql.Int, UserID);
        const query = `SELECT ID, Name
                       FROM Meal 
                       WHERE UserID = @UserID`;
        const result = await request.query(query);
        console.log('Meals found:', result.recordset);
        return result.recordset;
    } catch (error) {
        console.error('Error in getMeals:', error);
        throw error;
    }
}

module.exports.getMeals = getMeals;