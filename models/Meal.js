const sql = require('mssql');
const config = require('../config');


// Dunktion til at indsætte et måltid i databasen
async function insertMealIntoDatabase(name, userID) { 
    try {

        await sql.connect(config);
    
        const request = new sql.Request();
    
        // SQL-foresørgsel til at indsætte måltid i databasen
        const query = `
            INSERT INTO Meal (Name, UserID)
            VALUES ('${name}', '${userID}');
            SELECT SCOPE_IDENTITY() AS id;
            `;

        let queryResult = await request.query(query);
        mealID = queryResult.recordset[0].id;
    
        // Bruges til at kontrollere om tingene indsættes korrekt
        console.log(`Meal with name "${name}" inserted into database with id: ${mealID}, under the user with id: ${userID}`);
    } catch (error) {
        console.error('Error inserting meal into database.', error);
                throw error;
    }
}
module.exports.insertMealIntoDatabase = insertMealIntoDatabase;

// Funktion til at hente alle måltider for en bestemt bruger fra databasen
async function addAllMealsIntoTable(userID) {
    try {
        await sql.connect(config);
        const request = new sql.Request();

        // SQL forespørgsel til at hente navn, ID og næringsindhold for måltider tilhørende en bestemt bruger
        const query = `
            SELECT 
            Name AS Name, 
            ID AS ID,
            Calories AS Calories,
            Protein AS Protein,
            Fat AS Fat,
            Fiber AS Fiber
            FROM Meal WHERE UserID = '${userID}';`;
        const result = await request.query(query);                
        return result.recordset;
                
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw error;
    }
}
module.exports.addAllMealsIntoTable = addAllMealsIntoTable;


// Funktion til at hente ingredienser for et bestemt måltid fra databasen
async function getMealIngredients(ID) {
    try {
        await sql.connect(config);
    
        const request = new sql.Request();     
    
        const query = `
            SELECT 
                i.Name AS IngredientName,
                mi.Amount AS Amount,
                mi.Calories AS Calories,
                mi.Protein AS Protein,
                mi.Fat AS Fat,
                mi.Fiber AS Fiber
            FROM
                MealIngredient mi
            JOIN
                Ingredient i ON mi.IngredientID = i.IngredientID
            WHERE
                mi.MealID = ${ID};
            `;
    
        const result = await request.query(query);
    
        return result.recordset;

    } catch (error) {
        console.error('Error fetching meal ingredients.', error);
            throw error;
    }

}

module.exports.getMealIngredients = getMealIngredients;


// Funktion til at hente et måltid ud fra dets ID
async function getMealByID(ID) {
    try {
        await sql.connect(config);

        const request = new sql.Request();

        const query = `SELECT Name, ID FROM Meal WHERE ID = ${ID};`;

        const result = await request.query(query);

        //console.log(result.recordset[0]); - Brugt til testing
            
        return result.recordset[0];

    } catch (error) {
        console.error('Error fetching meal by ID.', error);
        throw error;
    }
    
}
module.exports.getMealByID = getMealByID;


// Funktion til at slette et måltid fra databasen baseret på dets ID
async function deleteMealFromDatabase(ID) {
    try {

        await sql.connect(config);
    
        const request = new sql.Request();

        // SQL-forespørgsel til at slette måltidsingredienser fra "MealIngredient" tabellen
        // og måltider fra "Meal" tabellen, begge baseret på måltids-ID'et
        const query = `
            DELETE FROM MealIngredient WHERE MealID = ${ID};
            DELETE FROM Meal WHERE ID = ${ID};`
    
    
        await request.input('id', ID).query(query);
            
        console.log(`Meal with ID "${ID}" deleted from database.`); // Bruges til at sikre at tingene bliver slettet korrekt
    } catch (error) {
        console.error('Error deleting meal from database.', error);
        throw error;
    }
}
    
module.exports.deleteMealFromDatabase = deleteMealFromDatabase;

// Funktion til at beregne kcal per tilføjede ingrediens
async function getTotalEnergy(mealID, name) {
    await sql.connect(config);

    const request = new sql.Request();

    // ID'et hentes for en ingrediens baseret på dens navn
    const query1 = `
        SELECT IngredientID
        FROM Ingredient 
        WHERE Name = '${name}';`;

    let result1 = await request.query(query1);
    //console.log(result1); - Brugt til testing
    // Definere at ingredientID er resultatet fra tidligere SQL forespørgsel.
    let ingredientID = result1.recordset[0].IngredientID;


    // Beregner de samlede kalorier for ingrediensen baseret på dens mængde i måltidet
    const query2 = `
        SELECT (i.Calories/100 * mi.Amount) AS TotalCalories
        FROM MealIngredient mi
        JOIN Ingredient i ON mi.IngredientID = i.IngredientID
        WHERE mi.MealID = '${mealID}' AND i.IngredientID = '${ingredientID}';`;
    
    let result2 = await request.query(query2);
    let totalCalories = result2.recordset[0].TotalCalories;
    //console.log(totalCalories); - Brugt til testing

    // Den beregnede værdi indsættes i 'Calories' kolonnen i MealIngredient tabellen i databasen.
    const insertQuery = `
        UPDATE MealIngredient 
        SET calories = '${totalCalories}'
        WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';`;

    await request.query(insertQuery);

    // Returnere den beregnedde værdi for samlede kalorier
    return totalCalories;
}

module.exports.getTotalEnergy = getTotalEnergy;


// Denne benytter samme logik getTotalEnergy
async function getTotalProtein(mealID, name) {

    await sql.connect(config);
    
    const request = new sql.Request();

    const query1 = `
        SELECT IngredientID
        FROM Ingredient 
        WHERE Name = '${name}';`
    
    let result1 = await request.query(query1);
    //console.log(result1); - Brugt til testing
    
    let ingredientID = result1.recordset[0].IngredientID;
    //console.log(ingredientID); - Brugt til testing
    
    const query2 = `
        SELECT (i.Protein/100 * mi.Amount) AS TotalProtein
        FROM MealIngredient mi
        JOIN Ingredient i ON mi.IngredientID = i.IngredientID
        WHERE mi.MealID = '${mealID}' AND i.IngredientID = '${ingredientID}';`;
    
    const result2 = await request.query(query2);
    
    let totalProtein = result2.recordset[0].TotalProtein;


    const insertQuery = `
        UPDATE MealIngredient 
        SET Protein = '${totalProtein}'
        WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';`;

    await request.query(insertQuery);

    return totalProtein;
};
    
module.exports.getTotalProtein = getTotalProtein;



// Denne benytter samme logik getTotalEnergy
async function getTotalFat(mealID, name) {

    await sql.connect(config);
        
    const request = new sql.Request();

    const query1 = `
        SELECT IngredientID
        FROM Ingredient 
        WHERE Name = '${name}';`
            
    let result1 = await request.query(query1);
    //console.log(result1); - Brugt til testing
        
    let ingredientID = result1.recordset[0].IngredientID;
    //console.log(ingredientID); - Brugt til testing

    const query2 = `
        SELECT (i.Fat/100 * mi.Amount) AS TotalFat
        FROM MealIngredient mi
        JOIN Ingredient i ON mi.IngredientID = i.IngredientID
        WHERE mi.MealID = '${mealID}' AND i.IngredientID = '${ingredientID}';`;
    
    const result2 = await request.query(query2);
    
    let totalFat = result2.recordset[0].TotalFat;

    const insertQuery = `
        UPDATE MealIngredient 
        SET Fat = '${totalFat}'
        WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';`;

    await request.query(insertQuery);

    return totalFat;
};
        
module.exports.getTotalFat = getTotalFat;



// Denne benytter samme logik getTotalEnergy
async function getTotalFiber(mealID, name) {

    await sql.connect(config);
    
    const request = new sql.Request();

    const query1 = `
        SELECT IngredientID
        FROM Ingredient 
        WHERE Name = '${name}';`
    
    let result1 = await request.query(query1);
    //console.log(result1); - Brugt til testing
    
    let ingredientID = result1.recordset[0].IngredientID;
    //console.log(ingredientID); - Brugt til testing

    const query2 = `
        SELECT (i.Fiber/100 * mi.Amount) AS TotalFiber
        FROM MealIngredient mi
        JOIN Ingredient i ON mi.IngredientID = i.IngredientID
        WHERE mi.MealID = '${mealID}' AND i.IngredientID = '${ingredientID}';`;
    
    let result2 = await request.query(query2);

    let totalFiber = result2.recordset[0].TotalFiber;

    const insertQuery = `
        UPDATE MealIngredient 
        SET Fiber = '${totalFiber}'
        WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';`;

    await request.query(insertQuery);

    return totalFiber;
};
    
module.exports.getTotalFiber = getTotalFiber;



// Funktion til at slette en måltidsingrediens fra databasen baseret på måltids ID og ingrediens ID
async function deleteMealIngredientFromDatabase(mealID) {
    try {

        await sql.connect(config);

        const request = new sql.Request();

        // Forespørgsel til at hente ingrediens ID baseret på måltids ID
        const query1 = `
            SELECT IngredientID FROM MealIngredient WHERE MealID = '${mealID}';`;

        let result = await request.query(query1);
        let ingredientID = result.recordset[0].IngredientID;

        // Forespørgsel til at slette måltidsingrediensen fra databasen 
        // baseret på både ingrediens ID og måltids ID
        const query2= `
            DELETE FROM MealIngredient WHERE MealID = '${mealID}' 
            AND IngredientID = '${ingredientID}';
            `;
        
        await sql.query(query2);

        console.log(`Meal ingredient with ID "${mealID}" deleted from database "${ingredientID}".`); // Bruges til at sikre sletning foregår korrekt

    } catch (error) {
        console.error('Error deleting meal ingredient from database.', error);
        throw error;
    }
}
module.exports.deleteMealIngredientFromDatabase = deleteMealIngredientFromDatabase;


// Funktion til at beregne den samlede kalorier for et måltid og opdatere tabellen
// baseret på informationer fra mealIngredeint tabellen
async function getTotalEnergyPerMeal(mealID) {
    await sql.connect(config);

    const request = new sql.Request();
    
    // Forespørgsel for at beregne samlede kalorier for et måltid
    const query = `
        SELECT SUM (Calories) AS TotalCalories
        FROM MealIngredient
        WHERE MealID = ${mealID};`;

    let result = await request.query(query);
    
    // Den samlede kalorieværdi hentes fra resultatet af forespørgslen
    let totalCalories = result.recordset[0].TotalCalories;
    //console.log(totalCalories); - Brugt til fejlsøgning
    
    // SQL-forespørgsel til at opdatere måltabellen med den beregnede samlede kalorieværdi
    const insertQuery = `
        UPDATE Meal
        SET Calories = '${totalCalories}'
        WHERE ID = '${mealID}';`;
    
    await request.query(insertQuery);
    
    return totalCalories;
}
module.exports.getTotalEnergyPerMeal = getTotalEnergyPerMeal;


// Bruger samme logik som getTotalEnergyPerMeal
async function getTotalProteinPerMeal(mealID) {
    await sql.connect(config);

    const request = new sql.Request();
    
    const query = `
        SELECT SUM (Protein) AS TotalProtein
        FROM MealIngredient
        WHERE MealID = ${mealID};`;

    let result = await request.query(query);
    
    let totalProtein = result.recordset[0].TotalProtein;
    //console.log(totalProtein); - brugt til testing
    
    const insertQuery = `
        UPDATE Meal
        SET Protein = '${totalProtein}'
        WHERE ID = '${mealID}';`;
    
    await request.query(insertQuery);
    
    return totalProtein;
}
module.exports.getTotalProteinPerMeal = getTotalProteinPerMeal;


// Bruger samme logik som getTotalEnergyPerMeal
async function getTotalFatPerMeal(mealID) {
    await sql.connect(config);

    const request = new sql.Request();
    
    const query = `
        SELECT SUM (Fat) AS TotalFat
        FROM MealIngredient
        WHERE MealID = ${mealID};`;

    let result = await request.query(query);
    
    let totalFat = result.recordset[0].TotalFat;
    // console.log(totalFat); - Brugt til testing
    
    const insertQuery = `
        UPDATE Meal
        SET Fat = '${totalFat}'
        WHERE ID = '${mealID}';`;
    
    await request.query(insertQuery);
    
    return totalFat;
}
module.exports.getTotalFatPerMeal = getTotalFatPerMeal;


// Bruger samme logik som getTotalEnergyPerMeal
async function getTotalFiberPerMeal(mealID) {
    await sql.connect(config);

    const request = new sql.Request();
    
    const query = `
        SELECT SUM (Fiber) AS TotalFiber
        FROM MealIngredient
        WHERE MealID = ${mealID};`;

    let result = await request.query(query);
    
    let totalFiber = result.recordset[0].TotalFiber;
    //console.log(totalFiber); - Brugt til testing
    
    const insertQuery = `
        UPDATE Meal
        SET Fiber = '${totalFiber}'
        WHERE ID = '${mealID}';`;
    
    await request.query(insertQuery);
    
    return totalFiber;
}
module.exports.getTotalFiberPerMeal = getTotalFiberPerMeal;