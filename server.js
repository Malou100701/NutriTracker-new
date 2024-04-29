//Creating express server
const express = require("express");
const app = express();
const sql = require('mssql');
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


//Specifying the port
const port = process.env.PORT || 3300;


//Routes
const indexRoutes = require("./routes/indexRoutes");
app.use("/", indexRoutes);

//Listening on the port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });