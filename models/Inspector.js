const sql = require('mssql');
const config = require('../config');



//her tager vi fat i hver ingrediens via navn


class Inspector {
    constructor(Name) {
        this.Name = Name;
    }
    async inspectIngredient() {
        // Connect to SQL Server database
        await sql.connect(config);
        // Create SQL request object
        const request = new sql.Request();
        // Parameterized query for safety
        request.input('IngredientName', sql.VarChar, this.Name); //Fjern denne linje og indsæt ${IngredientName} i linje 26
        const query = `
            SELECT 
                Name, Calories, Protein, Fat, Fiber
            FROM
                Ingredients
            WHERE
                Ingredients.Name = @IngredientName;
        `;
        const result = await request.query(query);
        return result.recordset; // Ensure data is returned
    }
}


module.exports = Inspector;