const sql = require('mssql');
const config = require('../config');

// Med denne logik forsøger vi kun at tilføje en ting til database af brugerinput, dette mindsker chancen for fejl og er testet i postman. Ikke ændre dette.
// IKKE ÆNDRE

//URL = meal/mealID/view - så man kan se hvilke ingredienser der er i en meal

// Nedenstående virker og skal bare aktivteres når der tastes en ingrediens. 
// Det var aktiveret i går og virkede fra frontend af...
async function addIngredientToMeal(mealID, ingredientName, amount) {
    try {
        // Connect to SQL Server database
        await sql.connect(config);

        // Create SQL request object
        const request = new sql.Request();
        const query1 = `
            SELECT IngredientID
            FROM Ingredient 
            WHERE Name = '${ingredientName}';`
        
        let result1 = await request.query(query1);
        //console.log(result1);

        let ingredientID = result1.recordset[0].IngredientID;
        //console.log(ingredientID);

        // Query to insert the ingredient into the MealIngredient table
        const query2 = `
            INSERT INTO MealIngredient (MealID, IngredientID, Amount)
            VALUES ('${mealID}', '${ingredientID}', '${amount}');
            SELECT SCOPE_IDENTITY() AS id;
        `;

        
        // Execute the query to insert the meal ingredient
        let result2 = await request.query(query2);
        //console.log(result2);

        let mealIngredientID = result2.recordset[0].id;

        console.log(`Ingredient "${ingredientName}" added to meal ${mealID}`);
        return mealIngredientID;
    } catch (error) {
        console.error('Error adding ingredient to meal.', error);
        throw error;
    }

}
module.exports.addIngredientToMeal = addIngredientToMeal;
 
//edit/opdater funktion 
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


//ændre navnene til disse funktioner, så vi skjuler hvor det gemmes. så det er nemmere at ændre i fremtiden. ændre fx til savemealingredient





