const sql = require('mssql'); // Importerer mssql
const config = require('../config'); // Importerer config.js

// Funktionen henter kalorieindtag for de sidste 30 dage
async function getCalorieIntakeLast30Days(UserID) {
    await sql.connect(config); // Opretter forbindelse til databasen

    // SQL-query, der henter kalorieindtag for de sidste 30 dage
    const request = new sql.Request();
    // Dette SQL-forespørgsel genererer en rapport over det daglige kalorieindtag for en bestemt bruger i de sidste 30 dage,
    // ved at sammenkæde data fra flere tabeller: Meal, MealIngredient, Ingredient og Intake. Den sørger for også at skabe en række for hver dag, selvom der ikke er noget data for den dag.
    const query = `
        WITH DateRange AS (
            SELECT
                CAST(GETDATE() AS DATE) AS DateValue
            UNION ALL
            SELECT
                DATEADD(day, -1, DateValue)
            FROM
                DateRange
            WHERE
                DateValue > DATEADD(day, -30, GETDATE())
        ),
        Calories AS (
            SELECT
                CONVERT(date, intk.DateTime) AS Date,
                SUM(i.Calories * mi.Amount) AS DailyCalorieIntake
            FROM
                Meal m
            JOIN
                MealIngredient mi ON m.ID = mi.MealID
            JOIN
                Ingredient i ON mi.IngredientID = i.IngredientID
            JOIN
                Intake intk ON m.ID = intk.MealID
            WHERE
                intk.UserID = @UserID
                AND intk.MealID IS NOT NULL
                AND intk.DateTime >= DATEADD(day, -30, GETDATE())
            GROUP BY
                CONVERT(date, intk.DateTime)
        )
        SELECT
            d.DateValue AS Date,
            ISNULL(c.DailyCalorieIntake, 0) AS DailyCalorieIntake
        FROM
            DateRange d
        LEFT JOIN
            Calories c ON d.DateValue = c.Date
        OPTION (MAXRECURSION 31);
    `;
    // Vi udfører vores query, og returnerer resultatet
    request.input('UserID', sql.Int, UserID);
    const result = await request.query(query);
    return result.recordset;
}

// Funktionen henter kalorier forbrændt for de sidste 30 dage
async function getWaterLast30Days(UserID) {

    await sql.connect(config); // Opretter forbindelse til databasen
    // SQL-query, der henter kalorier forbrændt for de sidste 30 dage
    const request = new sql.Request();
    // Fungere på samme måde som getCalorieIntakeLast30Days, men er lavet seperat, da det er en anden type data, der skal hentes, og den skal vises i seperat i grafen
    const query = `
    WITH DateSeries AS (
        SELECT TOP (30) 
            CAST(DATEADD(DAY, ROW_NUMBER() OVER (ORDER BY a.object_id) - 30, GETDATE()) AS DATE) AS Date
        FROM sys.all_objects a
        CROSS JOIN sys.all_objects b
    )
    SELECT
        ds.Date,
        ISNULL(SUM(i.Amount), 0) AS TotalWater
    FROM DateSeries ds
    LEFT JOIN Intake i ON ds.Date = CAST(i.DateTime AS DATE)
        AND i.UserID = @UserID
        AND i.IngredientID = 45
    GROUP BY ds.Date
    ORDER BY ds.Date DESC;
    `;
    // Vi udfører vores query, og returnerer resultatet
    request.input('UserID', sql.Int, UserID);
    const result = await request.query(query);
    return result.recordset;

}

// Funktionen henter kalorier forbrændt for de sidste 30 dage
async function getCaloriesBurnedLast30Days(UserID) {

    await sql.connect(config); // Opretter forbindelse til databasen
    const request = new sql.Request();
    // SQL-query, der henter kalorier forbrændt for de sidste 30 dage, og giver dem tilbage i et array af objekter med `Date` og `DailyCaloriesBurned`
    // Den logger også dage hvor der ikke er forbrændt kalorier, og sætter DailyCaloriesBurned til 0
    const query = `
            WITH DateRange AS (
                SELECT
                    CAST(GETDATE() AS DATE) AS DateValue
                UNION ALL
                SELECT
                    DATEADD(day, -1, DateValue)
                FROM
                    DateRange
                WHERE
                    DateValue > DATEADD(day, -30, GETDATE())
            ),
            CaloriesBurned AS (
                SELECT
                    CONVERT(date, ua.DateTime) AS Date,
                    SUM(at.CaloriesPerMinute * ua.Duration) AS DailyCaloriesBurned
                FROM
                    UserActivity ua
                JOIN
                    ActivityType at ON ua.ActivityTypeID = at.ActivityTypeID
                WHERE
                    ua.UserID = @UserID
                    AND ua.DateTime >= DATEADD(day, -30, GETDATE())
                GROUP BY
                    CONVERT(date, ua.DateTime)
            )
            SELECT
                d.DateValue AS Date,
                ISNULL(cb.DailyCaloriesBurned, 0) AS DailyCaloriesBurned
            FROM
                DateRange d
            LEFT JOIN
                CaloriesBurned cb ON d.DateValue = cb.Date
            OPTION (MAXRECURSION 31);
        `;
    // Vi udfører vores query, og returnerer resultatet
    request.input('UserID', sql.Int, UserID);
    const result = await request.query(query);
    return result.recordset;

}

// Funktionen henter vandindtag per time for i dag
async function getWaterPerHourToday(UserID) {
    await sql.connect(config); // Opretter forbindelse til databasen
    // SQL-query, der henter vandindtag per time for i dag, og giver dem tilbage i et array af objekter med `Hour` og `TotalWater`
    // Den logger også timer hvor der ikke er indtaget vand, og sætter TotalWater til 0
    const result = await sql.query`
        WITH HourlySeries AS (
            SELECT TOP (24)
                DATEADD(HOUR, -ROW_NUMBER() OVER (ORDER BY object_id) + 1, GETDATE()) AS Hour
            FROM sys.all_objects
        )
        SELECT
            FORMAT(hs.Hour, 'yyyy-MM-dd HH:00:00') AS Hour,
            ISNULL(SUM(i.Amount), 0) AS TotalWater
        FROM HourlySeries hs
        LEFT JOIN Intake i ON
            CAST(hs.Hour AS DATE) = CAST(i.DateTime AS DATE)
            AND DATEPART(HOUR, hs.Hour) = DATEPART(HOUR, i.DateTime)
            AND i.UserID = ${UserID}
            AND i.IngredientID = 45
            AND i.DateTime >= DATEADD(HOUR, -24, GETDATE())
        GROUP BY hs.Hour
        ORDER BY hs.Hour DESC;
        `;
    return result.recordset;

}

// Funktionen henter kalorier indtaget per time for i dag
const getCaloriesIntakePerHourToday = async (UserID) => {
    const today = new Date(); // Opretter et nyt Date-objekt
    const dateStr = today.toISOString().slice(0, 10);  // Bruger toISOString til at formatere datoen som "YYYY-MM-DD"
    // SQL-query, der henter kalorier indtaget per time for i dag, og giver dem tilbage i et array af objekter med `Hour` og `Calories`
    // Den logger også timer hvor der ikke er indtaget kalorier, og sætter Calories til 0
    // Den bruger UNION ALL til at generere en række af timer fra 0 til 23, og LEFT JOIN til at kombinere data fra CaloriesData og Hours
    const query = `
        WITH Hours AS (
            SELECT 0 AS Hour UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
            SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL
            SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL
            SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL
            SELECT 23
        ),
        CaloriesData AS (
            SELECT DATEPART(hour, intk.DateTime) AS Hour, SUM(i.Calories * mi.Amount) AS Calories
            FROM Meal m
            JOIN MealIngredient mi ON m.ID = mi.MealID
            JOIN Ingredient i ON mi.IngredientID = i.IngredientID
            JOIN Intake intk ON m.ID = intk.MealID
            WHERE intk.UserID = @UserID AND CONVERT(date, intk.DateTime) = @dateStr
            GROUP BY DATEPART(hour, intk.DateTime)
        )
        SELECT h.Hour, ISNULL(cd.Calories, 0) AS Calories
        FROM Hours h
        LEFT JOIN CaloriesData cd ON h.Hour = cd.Hour
        ORDER BY h.Hour;
    `;
    // Vi udfører vores query, og returnerer resultatet
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    request.input('dateStr', sql.VarChar, dateStr);
    const result = await request.query(query);
    return result.recordset;
};

// Funktionen henter kalorier forbrændt per time for i dag
const getCaloriesBurnedPerHourToday = async (userID, BMR) => {
    const today = new Date(); // Opretter et nyt Date-objekt
    const dateStr = today.toISOString().slice(0, 10);  // Bruger toISOString til at formatere datoen som "YYYY-MM-DD"
    // SQL-query, der henter kalorier forbrændt per time for i dag, og giver dem tilbage i et array af objekter med `Hour` og `Calories`
    // Den logger også timer hvor der ikke er forbrændt kalorier, og sætter Calories til BMR/24 så det er fordelt jævnt over dagen
    const query = `
        WITH Hours AS (
            SELECT 0 AS Hour UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL
            SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL
            SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL
            SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL
            SELECT 23
        ),
        BMR_Distributed AS (
            SELECT @bmr / 24 AS BMRPerHour  -- Calculate BMR per hour
        ),
        CaloriesData AS (
            SELECT DATEPART(hour, ua.DateTime) AS Hour, SUM(at.CaloriesPerMinute * ua.Duration) AS Calories
            FROM UserActivity ua
            JOIN ActivityType at ON ua.ActivityTypeID = at.ActivityTypeID
            WHERE ua.UserID = @userID AND CONVERT(date, ua.DateTime) = @dateStr
            GROUP BY DATEPART(hour, ua.DateTime)
        )
        SELECT h.Hour, ISNULL(cd.Calories, 0) + bmr.BMRPerHour AS Calories
        FROM Hours h
        CROSS JOIN BMR_Distributed bmr
        LEFT JOIN CaloriesData cd ON h.Hour = cd.Hour
        ORDER BY h.Hour;
    `;
    // Vi udfører vores query, og returnerer resultatet
    const request = new sql.Request();
    request.input('userID', sql.Int, userID);
    request.input('bmr', sql.Float, BMR); // Ensure BMR is passed correctly
    request.input('dateStr', sql.VarChar, dateStr);
    const result = await request.query(query);
    return result.recordset;
};



module.exports = {
    getCalorieIntakeLast30Days,
    getCaloriesBurnedLast30Days,
    getCaloriesIntakePerHourToday,
    getCaloriesBurnedPerHourToday,
    getWaterPerHourToday,
    getWaterLast30Days
};