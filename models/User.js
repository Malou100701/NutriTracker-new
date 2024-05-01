const sql = require('mssql');
const config = require('../config');
const bcrypt = require('bcrypt')


class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async registerUser(res) {
        if (!this.username || !this.password) {
        return res.status(400).send('Username and password are required.');
        }

        const hashedPassword = await bcrypt.hash(this.password, 10);
        await sql.connect(config);
        const result = await sql.query`
        INSERT INTO 
            Users (Username, Password)
        VALUES 
                (${this.username}, ${hashedPassword})`;
        res.send('User registered successfully!');
        console.log('User registered successfully!');

    };

    async loginUser(){

    };


    
}


// Dette er register funktionen, som virkede inden MVC blev implementeret
    // app.post('/register.html', async (req, res) => {
    //     const { username, password, email, age, weight, gender } = req.body;
    //     try {
    //         const hashedPassword = await bcrypt.hash(password, 10);
    //         await sql.connect(config);
    //         const result = await sql.query(`INSERT INTO Users (username, password, email, age, weight, gender) VALUES ('${username}', '${hashedPassword}', '${email}', ${age || null}, ${weight || null}, '${gender || null}')`);
    //         res.redirect('/login.html'); // Redirect to login page after successful registration
    //     } catch (error) {
    //         res.status(500).send('Error creating user');
    //     }
    // });



// Dette er login funktionen, som drengene arbejder på
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

module.exports = User;