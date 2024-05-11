// Importerer mssql-modulet så vi kan tilgå vores Microsoft SQL Server.
const sql = require('mssql');

//Importerer databasekonfigurationen
const config = require('../config');

//Her søges efter ingredienser baseret på et delvist navn for funktioner som autofuldførelse.
//denne bruges til selve søgeknappen på siden
async function inspectIngredient(name) {

    await sql.connect(config);

    const request = new sql.Request();

    const query = `
        SELECT IngredientID, Name FROM Ingredient WHERE Name LIKE '%${name}%'`;
    
    const result = await request.query(query);
    return result.recordset; 
}

module.exports.inspectIngredient = inspectIngredient;




// Bruges til at vise ernæringsdetaljer om en fødevare/ingrediens ved at søge efter dens navn i databasen
async function showIngredient(name) {

    await sql.connect(config);

    const request = new sql.Request();

    const query = `
        SELECT Name AS Name, 
        Calories, Protein, Fat, Fiber
        FROM Ingredient
        WHERE Name = '${name}';`;
    
    
    const result = await request.query(query);
    return result.recordset[0]; // Antager kun ét resultat pga. unikt navn.
}
module.exports.showIngredient = showIngredient;


//Overordnet kommentarer: 
//Der bruges async for at kunne bruge await, som venter på at databasen svarer. Dette bruges for at undgå at databasen svarer for sent, og at programmet derfor ikke kan fortsætte.
//Module.exports = gør at andre filer i applikationen kan bruge funktionerne.
