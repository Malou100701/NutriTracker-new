// Importerer mssql-modulet
const sql = require('mssql');

//Importerer databasekonfigurationen
const config = require('../config');



//Funktion til at inspicere en ingrediens ved at søge efter dens navn i databasen
async function inspectIngredient(name) {

    // Opretter forbindelse til SQL Server Databasen ved hjælp af konfigurationen
    await sql.connect(config);

    // Opretter en SQL-forespørgsel til databasen
    const request = new sql.Request();

    // SQL-forespørgsel til at hente Ingrediens ID og navn fra Ingrediens tabel,
    // hvor navnet delvist matcher det, der er angivet i 'name'-variablen
    const query = `
        SELECT IngredientID, Name FROM Ingredient WHERE Name LIKE '%${name}%'`;
    
    // Udfører forespørgslen og returnere resultatet
    const result = await request.query(query);
    return result.recordset; 
}
// Eksporterer funktionen til inspektion af ingredienser for brug i andre dele af applikationen
module.exports.inspectIngredient = inspectIngredient;


// Funktion til at vise detaljer om en ingrediens ved at søge efter dens navn i databasen
async function showIngredient(name) {

    await sql.connect(config);

    const request = new sql.Request();

    // SQL-forespørgsel for at hente detaljer og ingrediensen baseret på dens navn
    const query = `
        SELECT Name AS Name, 
        Calories, Protein, Fat, Fiber
        FROM Ingredient
        WHERE Name = '${name}';`;
    
    
    // Udfører forespørgslen og returnerer resultatet
    const result = await request.query(query);
    return result.recordset[0]; // Returnerer det første resultat (forventet kun én ingrediens med det navn)
}
module.exports.showIngredient = showIngredient;