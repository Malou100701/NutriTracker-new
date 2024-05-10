// Ompirterer mssql-modulet
const sql = require('mssql');

// Omporterer databasekonfigurationen
const config = require('../config');

//Funktion til at søge efter ingredienser baseret på navn i databasen
async function searchByName (name) {
    try {
        // Opretter forbindelse til databasen ved hjælp af konfigurationen
        await sql.connect(config);

        // Opretter en ny forespørgsel til databasen
        const request = new sql.Request();

        // SQL-forespørgsel til at søge efter ingredienser med et lignende navn
        const query = `
            SELECT Name FROM Ingredient WHERE Name LIKE '%${name}%';`;

        // Udfører forespørgslen til databasen
        const result = await request.query(query);
        //console.log(result); - Brugt til testing

        //Returnerer resultatet af forespørgslen
        return result.recordset;
    } catch (error) {
        //Håndterer fejl ved forespørgslen og logger fejlmeddelelsen
        console.error('Error fetching ingredients:', error);
        throw error;
    }
};

//Eksporterer søgefunktionen for brug i andre dele af applikationen
module.exports.searchByName = searchByName;

