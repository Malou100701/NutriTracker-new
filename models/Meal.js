const sql = require('mssql');
const config = require('../config');



class Meal {
    constructor(mealID) {
        this.mealID = mealID;
    }


    // Method to get total nutrient of meal
    async getTotalNutrient() {
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
            Ingredients i ON mi.IngredientsID = i.IngredientID
        WHERE
            mi.MealID = ${this.mealID};`;

        const result = await request.query(query);

        console.log(result.recordset[0]);
        // Return total nutrient
        return result.recordset[0].TotalNutrient;
        
    }

};

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



// Versionen pigerne arbejder på
// app.post('/create-meal', async (req, res) => {
//     const { mealName } = req.body; // Extracting meal name from form data

//     try {
//         // Connect to SQL Server database
//         await sql.connect(config);

//         // Create SQL request object
//         const request = new sql.Request();

//         // Insert meal name into Meals table
//         const query = `INSERT INTO Meals (Name) VALUES ('${mealName}')`;
//         await request.query(query);

//         // Send success response
//         res.send('Meal created successfully');

//     } catch (err) {
//         // Handle errors
//         console.error('Error creating meal:', err);
//         res.status(500).send('An error occurred while creating meal');
//     } finally {
//         // Close SQL connection
//         await sql.close();
//     }
// });


module.exports = Meal;

