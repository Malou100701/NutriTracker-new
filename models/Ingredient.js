const sql = require('mssql');
const config = require('../config');

//Ingredienser baseret på navn i databasen
async function searchByName (name) {
    try {
        await sql.connect(config);
        const request = new sql.Request();
        const query = `
            SELECT Name FROM Ingredient WHERE Name LIKE '%${name}%';`;
        const result = await request.query(query);
        //console.log(result); - Brugt til testing
        return result.recordset;

    } catch (error) {
        console.error('Error fetching ingredients:', error);
        throw error;
    }
};
module.exports.searchByName = searchByName;

