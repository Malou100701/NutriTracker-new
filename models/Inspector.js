const sql = require('mssql');
const config = require('../config');



//her tager vi fat i hver ingrediens via navn
async function inspectIngredient(name) {
        // Connect to SQL Server database
        await sql.connect(config);
        // Create SQL request object
        const request = new sql.Request();
        // Parameterized query for safety
        request.input('IngredientName', sql.VarChar, name); //Fjern denne linje og indsæt ${IngredientName} i linje 26
        const query = `
            SELECT 
                Name, Calories, Protein, Fat, Fiber
            FROM
                Ingredient
            WHERE
                Ingredient.Name = ${name};
        `;
        const result = await request.query(query);
        return result.recordset; // Ensure data is returned
    }

module.exports.inspectIngredient = inspectIngredient;