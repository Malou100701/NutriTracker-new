
//Importer MSSQL-modulet til at kommunikere med SQL Server-databasen
const sql = require('mssql');

//Importer konfigurationsindstillinger fra en anden fil
const config = require('../config');


// Funktion til at tilføje ingredienser til et måltid
async function addIngredientToMeal(mealID, ingredientName, amount) {
    
    // Starter en try-blok, hvor al kode inden for blokken vil blive forsøgt udført.
    try {

        await sql.connect(config);

        const request = new sql.Request();

        // Forespørgsel for at finde IngredientID baseret på navn
        const query1 = `
            SELECT IngredientID
            FROM Ingredient 
            WHERE Name = '${ingredientName}';`
        
        let result1 = await request.query(query1);
        //console.log(result1); - Brugt til fejlsøgning

        //Denne udtrækker IngredientID fra resultatet af den foregående forespørgsel.
        let ingredientID = result1.recordset[0].IngredientID;
        //console.log(ingredientID); - Brugt til fejlsøgning


        // SQL-forespørgsel til at indsætte en ny række i MealIngredient-tabellen med det angivne måltids ID, ingrediens ID og mængde.
        // Det inkluderer også en forespørgsel til at få det nyindsatte id ved hjælp af SCOPE_IDENTITY() funktionen.
        const query2 = `
            INSERT INTO MealIngredient (MealID, IngredientID, Amount)
            VALUES ('${mealID}', '${ingredientID}', '${amount}');
            SELECT SCOPE_IDENTITY() AS id;
        `;
        
        // Denne linje udfører og venter på resultatet fra vores query 2
        let result2 = await request.query(query2);
        //console.log(result2); - Brugt til fejlsøgning

        // Dette udtrækker det nyindsatte 'id' fra resultatet af 'query2'
        let mealIngredientID = result2.recordset[0].id;

        // Dette logger en besked der angiver, at ingrediensen er blevet tilføjet til måltidet.
        console.log(`Ingredient "${ingredientName}" added to meal ${mealID}`);

        // Dette returnere 'mealIngredientID' fra funktionen, hvilket angiver, at funktionen er lykkes
        return mealIngredientID;

    // Dette starter en catch-blok til at håndtere eventuelle fejl, det opstår inden for try-blokken.
    } catch (error) {

        // Hvis en fejl opstår, logger dette en fejlmeddelelse, der angiver, at det mislykkedes at tilføje ingrediensen til måltidet.
        console.error('Error adding ingredient to meal.', error);
        throw error;
    }

}
module.exports.addIngredientToMeal = addIngredientToMeal;
 


// Denne funktion bliver ikke brugt, da vi ved udarbejdelsen af frontend ikke fandt det relevant at lave en edit knap, 
//da man kan slette, se og søge alle ens ingredienser
// Denne kunne have været brugt som edit knap
/*
async function updateMealIngredientInDatabase(ID, amount) {
    try {
        // Connect SQL Server Database
        await sql.connect(config);

        // Create SQL request object
        const request = new sql.Request();

        // Query to update meal ingredient in database
        const query = `
        UPDATE MealIngredient
        SET Amount = ${amount}
        WHERE ID = ${ID}
        ;`
 
        let result = await sql.query(query);
        console.log(result);
        console.log(`Meal ingredient with ID "${ID}" amount updated to "${amount}" in database.`);

    } catch (error) {
        console.error('Error updating meal ingredient in database.', error);
        throw error;
    }
}
module.exports.updateMealIngredientInDatabase = updateMealIngredientInDatabase;
*/




