const sql = require('mssql');
const config = require('../config');

// Med denne logik forsøger vi kun at tilføje en ting til database af brugerinput, dette mindsker chancen for fejl og er testet i postman. Ikke ændre dette.
// IKKE ÆNDRE

async function addIngredientToMeal(mealID, ingredientName) {
    try {
        // Connect to SQL Server database
        await sql.connect(config);

        // Create SQL request object
        const request = new sql.Request();

        // Query to insert the ingredient into the MealIngredient table
        const query = `
            INSERT INTO MealIngredient (MealID, IngredientID)
            SELECT ${mealID}, IngredientID
            FROM Ingredient 
            WHERE Name = '${ingredientName}'
        `;

        // Execute the query to insert the meal ingredient
        await request.query(query);

        console.log(`Ingredient "${ingredientName}" added to meal ${mealID}`);
    } catch (error) {
        console.error('Error adding ingredient to meal.', error);
        throw error;
    }
}
module.exports.addIngredientToMeal = addIngredientToMeal;

async function deleteMealIngredientFromDatabase(ID) {
        try {
            // Connect SQL Server Database
            await sql.connect(config);

            // Create SQL request object
            const request = new sql.Request();

            // Query to delete meal ingredient from database
            const query = `
                DELETE FROM MealIngredient
                WHERE ID = ${ID};
            `;
            await sql.query(query);
            console.log(`Meal ingredient with ID "${ID}" deleted from database.`);

        } catch (error) {
            console.error('Error deleting meal ingredient from database.', error);
            throw error;
        }
    }
module.exports.deleteMealIngredientFromDatabase = deleteMealIngredientFromDatabase;
 
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
        WHERE ID = ${ID};
        `;
        await sql.query(query);
        console.log(`Meal ingredient with ID "${ID}" amount updated in database.`);

    } catch (error) {
        console.error('Error updating meal ingredient in database.', error);
        throw error;
    }
}
module.exports.updateMealIngredientInDatabase = updateMealIngredientInDatabase;


//ændre navnene til disse funktioner, så vi skjuler hvor det gemmes. så det er nemmere at ændre i fremtiden. ændre fx til savemealingredient





