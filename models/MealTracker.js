const sql = require('mssql');
const config = require('../config');
const moment = require('moment-timezone');






async function trackMeal(UserID, MealID, DateTime, Amount, latitude, longitude) {
    const adjustedDatetime = moment.utc(DateTime).add(0, 'hours').format('YYYY-MM-DD HH:mm:ss');

    await sql.connect(config);
    await sql.query`
        INSERT INTO Intake (UserID, MealID, DateTime, Amount, Location)
        VALUES (${UserID}, ${MealID}, ${adjustedDatetime}, ${Amount}, ${latitude + ',' + longitude})`;    
}

module.exports.trackMeal = trackMeal;

/*
async function renderMeals(UserID, MealID = null, IngredientID = null) {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);

    let query = `SELECT M.ID, M.Name, I.DateTime, I.Amount, I.IntakeID
                 FROM Meal M
                 JOIN Intake I ON M.ID = I.MealID
                 WHERE I.UserID = @UserID`;

    if (MealID !== null) {
        request.input('MealID', sql.Int, MealID);
        query += ' AND M.ID = @MealID'; // Condition for MealID
    }

    if (IngredientID !== null) {
        request.input('IngredientID', sql.Int, IngredientID);
        query += ' AND I.IngredientID = @IngredientID'; // Condition for IngredientID
    }

    const result = await request.query(query);
    console.log(result.recordset);
    return result.recordset;
}
*/

async function renderMeals(UserID) {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    const query = `
        SELECT I.IntakeID, M.Name as MealName, Ing.Name as IngredientName, I.DateTime, I.Amount
        FROM Intake I
        LEFT JOIN Meal M ON I.MealID = M.ID
        LEFT JOIN Ingredient Ing ON I.IngredientID = Ing.IngredientID
        WHERE I.UserID = @UserID
        ORDER BY I.DateTime DESC;`;
    const result = await request.query(query);
    return result.recordset;
}

module.exports.renderMeals = renderMeals;


async function updateMeal(UserID, IntakeID, DateTime, Amount, MealID = null, IngredientID = null) {
    await sql.connect(config);
    const adjustedDatetime = moment.utc(DateTime).add(4, 'hours').format('YYYY-MM-DD HH:mm:ss');
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    request.input('IntakeID', sql.Int, IntakeID);
    request.input('DateTime', sql.DateTime, adjustedDatetime);
    request.input('Amount', sql.Int, Amount);

    if (MealID !== null) {
        request.input('MealID', sql.Int, MealID);
    }
    if (IngredientID !== null) {
        request.input('IngredientID', sql.Int, IngredientID);
    }

    console.log('Updating meal with:', { UserID, IntakeID, adjustedDatetime, Amount, MealID, IngredientID });
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

    const result = await request.query(updateQuery);
    console.log(result.rowsAffected[0] + ' rows updated');
    return result.rowsAffected[0]; // Returns the number of affected rows
}
module.exports.updateMeal = updateMeal;

async function deleteMeal(IntakeID) {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('IntakeID', sql.Int, IntakeID);
        const result = await request.query(`
            DELETE FROM Intake
            WHERE IntakeID = @IntakeID;
        `);
        return result.rowsAffected[0];  // Returns the number of rows affected
}

module.exports.deleteMeal = deleteMeal;

async function trackWater(UserID, DateTime, Amount, latitude, longitude) {
    const adjustedDatetime = moment.utc(DateTime).add(0, 'hours').format('YYYY-MM-DD HH:mm:ss');

    await sql.connect(config);
    await sql.query`
        INSERT INTO Intake (UserID, IngredientID, DateTime, Amount, Location)
        VALUES (${UserID}, 45, ${adjustedDatetime}, ${Amount}, ${latitude + ',' + longitude})`;    
}
module.exports.trackWater = trackWater;

async function trackIngredient(UserID, IngredientID, DateTime, Amount, latitude, longitude) {
    const adjustedDatetime = moment.utc(DateTime).add(0, 'hours').format('YYYY-MM-DD HH:mm:ss');
    console.log('Tracking ingredient with:', { UserID, IngredientID, adjustedDatetime, Amount, latitude, longitude });
    await sql.connect(config);
    await sql.query`
        INSERT INTO Intake (UserID, IngredientID, DateTime, Amount, Location)
        VALUES (${UserID}, ${IngredientID}, ${adjustedDatetime}, ${Amount}, ${latitude + ',' + longitude})`;
}
module.exports.trackIngredient = trackIngredient;



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