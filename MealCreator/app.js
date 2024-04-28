const express = require('express');
const sql = require('mssql');
const app = express();
app.use(express.static('.'));



const config = {
    user: 'NutriTracker@nutritracker12',
    password: 'Gruppe5!',
    server: 'nutritracker12.database.windows.net',
    database: 'EksamensOpgaveNT',
    options: {
        encrypt: true, // Enable encryption - is this needed?
        trustServerCertificate: false, // Do not trust the server certificate
        enableArithAbort: true // Enable ArithAbort option
    }
}; 

//DOES NOT WORK YET

app.post('/create-meal', async (req, res) => {
    const { mealName } = req.body; // Extracting meal name from form data

    try {
        // Connect to SQL Server database
        await sql.connect(config);

        // Create SQL request object
        const request = new sql.Request();

        // Insert meal name into Meals table
        const query = `INSERT INTO Meals (Name) VALUES ('${mealName}')`;
        await request.query(query);

        // Send success response
        res.send('Meal created successfully');

    } catch (err) {
        // Handle errors
        console.error('Error creating meal:', err);
        res.status(500).send('An error occurred while creating meal');
    } finally {
        // Close SQL connection
        await sql.close();
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});





