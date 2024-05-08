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
    
            //console.dir(queryResult)
            console.log(`Meal with name "${name}" inserted into database with id: ${mealID}, under the user with id: ${userID}`);
            } catch (error) {
                console.error('Error inserting meal into database.', error);
                throw error;
            }
        }
        module.exports.insertMealIntoDatabase = insertMealIntoDatabase;

    async function addAllMealsIntoTable(userID) {
            try {
                await sql.connect(config);
                const request = new sql.Request();
                const query = `SELECT Name, ID FROM Meal WHERE UserID = '${userID}';`;
                const result = await request.query(query);
                return result.recordset;
            } catch (error) {
                console.error('Error fetching meals:', error);
                throw error;
            }
        }
        module.exports.addAllMealsIntoTable = addAllMealsIntoTable;




    async function getMealIngredients(ID) {
            try {
                // Connect to SQL Server database
                await sql.connect(config);
    
                // Create SQL request object
                const request = new sql.Request();
    
                // Query to get meal ingredients from database
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
    
                //console.log(result.recordset);
                // Return meal ingredients
                return result.recordset;
            } catch (error) {
                console.error('Error fetching meal ingredients.', error);
                throw error;
            }

    }

    module.exports.getMealIngredients = getMealIngredients;

async function getMealByID(ID) {
        try {
            // Connect to SQL Server database
            await sql.connect(config);

            // Create SQL request object
            const request = new sql.Request();

            // Query to get meal by ID
            const query = `SELECT Name, ID FROM Meal WHERE ID = ${ID};`;

            const result = await request.query(query);

            console.log(result.recordset[0]);
            // Return meal
            return result.recordset[0];
        } catch (error) {
            console.error('Error fetching meal by ID.', error);
            throw error;
        }
    
    }
    module.exports.getMealByID = getMealByID;

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

// Denne virker for kalorier
async function getTotalEnergy(mealID, name) {
//Connect to SQL Server database
 await sql.connect(config);

//Create SQL request object
const request = new sql.Request();
const query1 = `
    SELECT IngredientID
    FROM Ingredient 
    WHERE Name = '${name}';`

let result1 = await request.query(query1);
//console.log(result1);

let ingredientID = result1.recordset[0].IngredientID;


const query2 = `SELECT (i.Calories/100 * mi.Amount) AS TotalCalories
FROM MealIngredient mi
JOIN Ingredient i ON mi.IngredientID = i.IngredientID
WHERE mi.MealID = '${mealID}' AND i.IngredientID = '${ingredientID}';`;
let result2 = await request.query(query2);

let totalCalories = result2.recordset[0].TotalCalories;
console.log(totalCalories);

// Insert TotalCalories into MealIngredient table
const insertQuery = `
    UPDATE MealIngredient 
    SET calories = '${totalCalories}'
    WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';`;

await request.query(insertQuery);

// Return the calculated TotalCalories value
return totalCalories;
}

module.exports.getTotalEnergy = getTotalEnergy;


// Denne virker for kalorier
async function getTotalProtein(mealID, name) {
    //Connect to SQL Server database
     await sql.connect(config);
    
    //Create SQL request object
    const request = new sql.Request();
    const query1 = `
        SELECT IngredientID
        FROM Ingredient 
        WHERE Name = '${name}';`
    
    let result1 = await request.query(query1);
    //console.log(result1);
    
    let ingredientID = result1.recordset[0].IngredientID;
    //console.log(ingredientID);
    //console.log(mealID);
    
    const query2 = `SELECT (i.Protein/100 * mi.Amount) AS TotalProtein
    FROM MealIngredient mi
    JOIN Ingredient i ON mi.IngredientID = i.IngredientID
    WHERE mi.MealID = '${mealID}' AND i.IngredientID = '${ingredientID}';`;
    const result2 = await request.query(query2);
    
    let totalProtein = result2.recordset[0].TotalProtein;


// Insert TotalCalories into MealIngredient table
const insertQuery = `
    UPDATE MealIngredient 
    SET Protein = '${totalProtein}'
    WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';`;

await request.query(insertQuery);

// Return the calculated TotalProtein value
return totalProtein;
    };
    
module.exports.getTotalProtein = getTotalProtein;

async function getTotalFat(mealID, name) {
        //Connect to SQL Server database
         await sql.connect(config);
        
        //Create SQL request object
        const request = new sql.Request();
        const query1 = `
            SELECT IngredientID
            FROM Ingredient 
            WHERE Name = '${name}';`
        
        let result1 = await request.query(query1);
        //console.log(result1);
        
        let ingredientID = result1.recordset[0].IngredientID;
        //console.log(ingredientID);
        //console.log(mealID);
        
        const query2 = `SELECT (i.Fat/100 * mi.Amount) AS TotalFat
        FROM MealIngredient mi
        JOIN Ingredient i ON mi.IngredientID = i.IngredientID
        WHERE mi.MealID = '${mealID}' AND i.IngredientID = '${ingredientID}';`;
        const result2 = await request.query(query2);
    
        let totalFat = result2.recordset[0].TotalFat;


// Insert TotalFat into MealIngredient table
    const insertQuery = `
        UPDATE MealIngredient 
        SET Fat = '${totalFat}'
        WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';`;

    await request.query(insertQuery);

// Return the calculated TotalFat value
    return totalFat;
};
        
module.exports.getTotalFat = getTotalFat;


async function getTotalFiber(mealID, name) {
    //Connect to SQL Server database
     await sql.connect(config);
    
    //Create SQL request object
    const request = new sql.Request();
    const query1 = `
        SELECT IngredientID
        FROM Ingredient 
        WHERE Name = '${name}';`
    
    let result1 = await request.query(query1);
    //console.log(result1);
    
    let ingredientID = result1.recordset[0].IngredientID;
    //console.log(ingredientID);
    //console.log(mealID);
    
    const query2 = 
        `SELECT (i.Fiber/100 * mi.Amount) AS TotalFiber
        FROM MealIngredient mi
        JOIN Ingredient i ON mi.IngredientID = i.IngredientID
        WHERE mi.MealID = '${mealID}' AND i.IngredientID = '${ingredientID}';`;
    let result2 = await request.query(query2);

    let totalFiber = result2.recordset[0].TotalFiber;

// Insert TotalCalories into MealIngredient table
    const insertQuery = `
        UPDATE MealIngredient 
        SET Fiber = '${totalFiber}'
        WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';`;

    await request.query(insertQuery);

// Return the calculated TotalCalories value
    return totalFiber;
};
    
module.exports.getTotalFiber = getTotalFiber;

async function deleteMealIngredientFromDatabase(mealID) {
    try {
        // Connect SQL Server Database
        await sql.connect(config);

        // Create SQL request object
        const request = new sql.Request();

        // Query to delete meal ingredient from database
        const query= `
            DELETE FROM MealIngredient WHERE MealID = '${mealID}' AND IngredientID = '${ingredientID}';
        `;
        await sql.query(query);
        console.log(`Meal ingredient with ID "${mealID}" deleted from database.`);

    } catch (error) {
        console.error('Error deleting meal ingredient from database.', error);
        throw error;
    }
}
module.exports.deleteMealIngredientFromDatabase = deleteMealIngredientFromDatabase;


//  const result = await sql.query`
// UPDATE Users 
// SET Age = ${Age}, Weight = ${Weight}, Gender = ${Gender}
// WHERE Username = ${username}`;