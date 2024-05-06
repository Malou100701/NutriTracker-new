const sql = require('mssql');
const config = require('../config');

//den skal have et bedre navn, så det er nemmere at ændre i fremtiden.
async function insertMealIntoDatabase(name, userID) { //PROBLEMER MED DENNE. VI KAN IKKE FÅ DEN LINKET OP TIL EN USER
            try {
            // Connect SQL Server Database
                await sql.connect(config);
    
            // Create SQL request object
                const request = new sql.Request();
    
            //Query to insert meal into database
                const query = `
                INSERT INTO Meal (Name, UserID)
                VALUES ('${name}', '${userID}');
                SELECT SCOPE_IDENTITY() AS id;
            `;

            let queryResult = await request.query(query);
            mealID = queryResult.recordset[0].id;
    
            console.dir(queryResult)
            console.log(`Meal with name "${name}" inserted into database with id: ${mealID}, under the user with id: ${userID}`);
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
            const query = `DELETE FROM MealIngredient WHERE MealID = ${ID};
                        DELETE FROM Meal WHERE ID = ${ID};`
    
    
            // Execute the query with the ID parameter
            await request.input('id', ID).query(query);
    
            console.log(`Meal with ID "${ID}" deleted from database.`);
        } catch (error) {
            console.error('Error deleting meal from database.', error);
            throw error;
        }
    }
    
    module.exports.deleteMealFromDatabase = deleteMealFromDatabase;


async function addAllMealsIntoTable() {
    // Connect to SQL Server database
    await sql.connect(config);

    // Create SQL request object
    const request = new sql.Request();

    // Query to get all meals
    const query = `SELECT * FROM Meal WHERE UserID = ${userID};`;
    const result = await request.query(query);

    // Return all meals
    return result.recordset;
}

module.exports.addAllMealsIntoTable = addAllMealsIntoTable;

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



//    const result = await sql.query`
// UPDATE Users 
// SET Age = ${Age}, Weight = ${Weight}, Gender = ${Gender}
// WHERE Username = ${username}`;