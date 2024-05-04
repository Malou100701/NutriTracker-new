const sql = require('mssql');
const config = require('../config');

async function insertMealIngredientIntoDatabase(mealID, ingredientID, amount) {
        try {
            // Connect SQL Server Database
            await sql.connect(config);

            // Create SQL request object
            const request = new sql.Request();

            // Query to insert meal ingredient into database
            const query = `
                INSERT INTO MealIngredient (MealID, IngredientsID, Amount)
                VALUES (${mealID}, ${ingredientID}, ${amount});
            `;
            await sql.query(query);
            console.log(`Meal ingredient inserted into database.`);

        } catch (error) {
            console.error('Error inserting meal ingredient into database.', error);
            throw error;
        }
    }
module.exports.insertMealIngredientIntoDatabase = insertMealIngredientIntoDatabase;

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
 
//ændre navnene til disse funktioner, så vi skjuler hvor det gemmes. så det er nemmere at ændre i fremtiden. ændre fx til savemealingredient





