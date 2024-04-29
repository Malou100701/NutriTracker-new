const sql = require('mssql');
const config = {
    user: 'NutriTracker@nutritracker12',
    password: 'Gruppe5!',
    server: 'nutritracker12.database.windows.net',
    database: 'EksamensOpgaveNT',
    options: {
        encrypt: true, // Enable encryption
        trustServerCertificate: false, // Do not trust the server certificate
        enableArithAbort: true // Enable ArithAbort option
    }
}; 


class Meal {
    constructor(mealID) {
        this.mealID = mealID;
    }

    async getTotalEnergy() {
        // Connect to SQL Server database
        await sql.connect(config);

        // Create SQL request object
        const request = new sql.Request();

        // Query to get total energy of meal
        const query = `SELECT IngredientsID, Amount
                       FROM MealIngredient
                       WHERE MealIngredient.MealID = ${this.mealID}`;
        const result = await request.query(query);
        console.log(result);

        // Return total energy
        return result.recordset[0].TotalEnergy;
    }

};

module.exports = Meal;

