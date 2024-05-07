const sql = require('mssql');
const config = require('../config');



// Virker ikke, men skal tage for de sidsste 30 dage
// async function nutriTrackerView(UserID) {
//     await sql.connect(config);
//     const request = new sql.Request();
//     const query = `
//         WITH DateRange AS (
//             SELECT
//                 CAST(GETDATE() AS DATE) AS DateValue
//             UNION ALL
//             SELECT
//                 DATEADD(day, -1, DateValue)
//             FROM
//                 DateRange
//             WHERE
//                 DateValue > DATEADD(day, -30, GETDATE())
//         ),
//         Calories AS (
//             SELECT
//                 CONVERT(date, intk.DateTime) AS Date,
//                 SUM(i.Calories * mi.Amount) AS DailyCalorieIntake
//             FROM
//                 Meal m
//             JOIN
//                 MealIngredient mi ON m.ID = mi.MealID
//             JOIN
//                 Ingredient i ON mi.IngredientID = i.IngredientID
//             JOIN
//                 Intake intk ON m.ID = intk.MealID
//             WHERE
//                 intk.UserID = @UserID
//                 AND intk.MealID IS NOT NULL
//                 AND intk.DateTime >= DATEADD(day, -30, GETDATE())
//             GROUP BY
//                 CONVERT(date, intk.DateTime)
//         )
//         SELECT
//             d.DateValue AS Date,
//             ISNULL(c.DailyCalorieIntake, 0) AS DailyCalorieIntake
//         FROM
//             DateRange d
//         LEFT JOIN
//             Calories c ON d.DateValue = c.Date
//         OPTION (MAXRECURSION 31);
//     `;
//     request.input('UserID', sql.Int, UserID);
//     const result = await request.query(query);
//     console.log(result.recordset);
//     return result.recordset;
// }







// Virker med en enkelt dato
async function nutriTrackerView(UserID, date) {
// Connect to SQL Server database using provided configuration
await sql.connect(config);

// Create SQL request object
const request = new sql.Request();

// Query to get total calorie intake
const query = `
    SELECT SUM(i.Calories * mi.Amount * intk.Amount) AS TotalCalorieIntake
    FROM Meal m
    JOIN MealIngredient mi ON m.ID = mi.MealID
    JOIN Ingredient i ON mi.IngredientID = i.IngredientID
    JOIN Intake intk ON m.ID = intk.MealID
    WHERE intk.UserID = @UserId AND CONVERT(date, intk.DateTime) = @date AND intk.MealID IS NOT NULL;
`;

// Add parameters to avoid SQL injection
request.input('UserId', sql.Int, UserID);
request.input('date', sql.VarChar, date);
console.log('date', date);

// Execute the query
const result = await request.query(query);

// Output result to console for debugging
console.log(result.recordset[0].TotalCalorieIntake);

// Return total calorie intake
return result.recordset[0].TotalCalorieIntake || 0;
};

module.exports = {
    nutriTrackerView
};