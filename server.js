const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.static('public'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json

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


app.post('/register.html', async (req, res) => {
    const { username, password, email, age, weight, gender } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await sql.connect(config);
        const result = await sql.query(`INSERT INTO Users (username, password, email, age, weight, gender) VALUES ('${username}', '${hashedPassword}', '${email}', ${age || null}, ${weight || null}, '${gender || null}')`);
        res.redirect('/login.html'); // Redirect to login page after successful registration
    } catch (error) {
        res.status(500).send('Error creating user');
    }
});


/*
app.post('/login.html', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);

    if (user) {
        // Compare hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            res.status(200).send('Login successful');
        } else {
            res.status(400).send('Invalid username or password');
        }
    } else {
        res.status(400).send('Invalid username or password');
    }
});
*/

/*
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Received:", req.body);  // Log what is received
    try {
        await sql.connect(config);
        const request = new sql.Request();
        request.input('username', sql.VarChar, username);
        const result = await request.query('SELECT * FROM Users WHERE username = @username');

        if (result.recordset.length > 0) {
            const user = result.recordset[0];
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                res.status(200).send('Login successful');
            } else {
                console.log("Password mismatch");
                res.status(400).send('Invalid username or password');
            }
        } else {
            console.log("User not found");
            res.status(400).send('Invalid username or password');
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send('Error during login: ' + error.message);
    }
});

*/

const port = 3300;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})