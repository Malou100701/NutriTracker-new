const sql = require('mssql');
const config = require('../config');



//her tager vi fat i hver ingrediens via navn
async function inspectIngredient(name) {
        // Connect to SQL Server database
        await sql.connect(config);
        // Create SQL request object
        const request = new sql.Request();
        // Parameterized query for safety
        const query = `
            SELECT IngredientID, Name FROM Ingredient WHERE Name LIKE '%${name}%'`;
        const result = await request.query(query);
        return result.recordset; // Ensure data is returned
    }

module.exports.inspectIngredient = inspectIngredient;

async function showIngredient(name) {
    await sql.connect(config);
    const request = new sql.Request();

    const query = `
        SELECT Name AS Name, 
        Calories, Protein, Fat, Fiber
        FROM Ingredient
        WHERE Name = '${name}';`;
    
    const result = await request.query(query);
    return result.recordset[0];
}
module.exports.showIngredient = showIngredient;