const sql = require('mssql');
const config = require('../config');

//den skal have et bedre navn, så det er nemmere at ændre i fremtiden.
async function insertMealIntoDatabase(name) {
            try {
            // Connect SQL Server Database
                await sql.connect(config);
    
            // Create SQL request object
                const request = new sql.Request();
    
            //Query to insert meal into database
                const query = 
                `INSERT INTO Meal (Name)
                 VALUES ('${name}'); SELECT SCOPE_IDENTITY() AS id;` //det id der gemmes i databasen bliver også gemt i objektet ved scope identity. 
             ;
            let queryResult = await request.query(query);
            mealID = queryResult.recordset[0].id;
    
            console.dir(queryResult)
            console.log(`Meal with name "${name}" inserted into database with id: ${mealID}`);
            } catch (error) {
                console.error('Error inserting meal into database.', error);
                throw error;
            }
        }

        module.exports.insertMealIntoDatabase = insertMealIntoDatabase;


//nyt navn, så det er nemmere at ændre i fremtiden.
async function deleteMealFromDatabase(ID) {
        try {
            // Connect SQL Server Database
            await sql.connect(config);
    
            // Create SQL request object
            const request = new sql.Request();
    
            // Query to delete meal from database using the primary key column named "ID"
            const query = `DELETE FROM Meal WHERE ID = ${ID};`;
    
            // Execute the query with the ID parameter
            await request.input('id', ID).query(query);
    
            console.log(`Meal with ID "${ID}" deleted from database.`);
        } catch (error) {
            console.error('Error deleting meal from database.', error);
            throw error;
        }
    }
    
    module.exports.deleteMealFromDatabase = deleteMealFromDatabase;


    // Method to get total nutrient of meal
    async function getTotalNutrient(mealID) {
        // Connect to SQL Server database
        await sql.connect(config);

        // Create SQL request object
        const request = new sql.Request();

        // Query to get total nutrient of meal
        const query = 
        `SELECT 
            SUM(i.Calories * mi.Amount / 100) AS TotalCalories,
            SUM(i.Protein * mi.Amount / 100) AS TotalProtein,
            SUM(i.Fat * mi.Amount / 100) AS TotalFat,
            SUM(i.Fiber * mi.Amount / 100) AS TotalFiber
        FROM
            MealIngredient mi
        JOIN
            Ingredient i ON mi.IngredientsID = i.IngredientID
        WHERE
            mi.MealID = ${mealID};`;

        const result = await request.query(query); //

        console.log(result.recordset[0]);
        // Return total nutrient
        return result.recordset[0].TotalNutrient;
        
    }

    module.exports.getTotalNutrient = getTotalNutrient;



// Denne virker for kalorier
// async getTotalEnergy() {
//     // Connect to SQL Server database
//     await sql.connect(config);

//     // Create SQL request object
//     const request = new sql.Request();

//     // Query to get total energy of meal
//     const query = `SELECT SUM(i.Calories * mi.Amount) AS TotalCalories
//     FROM MealIngredient mi
//     JOIN Ingredients i ON mi.IngredientsID = i.IngredientID
//     WHERE mi.MealID = ${this.mealID};`;
//     const result = await request.query(query);

//     console.log(result.recordset[0]);
//     // Return total energy
//     return result.recordset[0].TotalEnergy;
    
// }



