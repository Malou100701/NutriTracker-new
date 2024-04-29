require('dotenv').config();

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


module.exports = config;