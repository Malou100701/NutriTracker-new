const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.static('.'));



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


//her tager vi fat i hver ingrediens via navn
app.get('/inspector/:Name', async (req, res) => {
    const { Name } = req.params;
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('Name', sql.NVarChar, `${Name}%`); //% = er et wildcard, og hvis det matcher med det der bliver søgt på, så kommer ingrediensen frem
        const result = await request.query('SELECT * FROM Ingredients WHERE Name LIKE @Name');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

