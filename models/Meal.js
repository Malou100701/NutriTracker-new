const sql = require('mssql');
const config = require('../config');

class Meal {
    constructor(mealID, name) {
        this.mealID = mealID;
        this.name = name;
    }
        //Method to insert name into database
        async insertMealIntoDatabase() {
            try {
            // Connect SQL Server Database
                await sql.connect(config);
    
            // Create SQL request object
                const request = new sql.Request();
    
            //Query to insert meal into database
                const query = 
                `INSERT INTO Meals (Name)
                VALUES ('${this.name}');`
             ;
            await request.query(query);
    
            console.log(`Meal with "${this.name}" inserted into database.`);
            } catch (error) {
                console.error('Error inserting meal into database.', error);
                throw error;
            }
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


module.exports = Meal;

