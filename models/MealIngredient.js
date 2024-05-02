const sql = require('mssql');
const config = require('../config');


class MealIngredient {
    constructor(mealID, ingredientID, amount) {
        this.mealID = mealID;
        this.ingredientID = ingredientID;
        this.amount = amount;
    }

    async insertMealIngredientIntoDatabase() {
        try {
            // Connect SQL Server Database
            await sql.connect(config);

            // Create SQL request object
            const request = new sql.Request();

            // Query to insert meal ingredient into database
            const query = `
                INSERT INTO MealIngredient (MealID, IngredientsID, Amount)
                VALUES (${this.mealID}, ${this.ingredientID}, ${this.amount});
            `;
            await sql.query(query);
            console.log(`Meal ingredient inserted into database.`);

        } catch (error) {
            console.error('Error inserting meal ingredient into database.', error);
            throw error;
        }
    }
}
    

module.exports = MealIngredient;



