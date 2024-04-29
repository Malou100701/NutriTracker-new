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
        request.input('IngredientName', sql.VarChar, this.Name);
        const query = `
            SELECT 
                Name, Calories, Protein, Fat, Fiber
            FROM
                Ingredients
            WHERE
                Ingredients.Name = @IngredientName;
        `;
        const result = await request.query(query);
        console.log(result.recordset[0]);
    }
}


// class Inspector {
//     constructor(Name) {
//         this.Name = Name;
        
//     }
//     async inspectIngredient() {

//         // Connect to SQL Server database
//         await sql.connect(config);

//         // Create SQL request object
//         const request = new sql.Request();

//         // Query to get total energy of meal
//         const query = 
//         `SELECT 
//             Name
//         FROM 
//             Ingredients
//         WHERE Ingredients.Name = ${this.Name};`;
        
//         const result = await request.query(query);

//         console.log(result.recordset[0]);
//         // Return total energy
//         return result.recordset[0].inspectIngredient;
        
//     }
// }
// app.get('/inspector/:Name', async (req, res) => {
//     const { Name } = req.params;
//     try {
//         await sql.connect(config);
//         const request = new sql.Request();
//         request.input('Name', sql.NVarChar, `${Name}%`); //% = er et wildcard, og hvis det matcher med det der bliver søgt på, så kommer ingrediensen frem
//         const result = await request.query('SELECT * FROM Ingredients WHERE Name LIKE @Name');
//         res.json(result.recordset);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });


module.exports = Inspector;