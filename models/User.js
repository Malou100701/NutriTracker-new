const sql = require('mssql');
const config = require('../config');
const bcrypt = require('bcrypt')


class User {
    constructor(username, password, email, age, weight, gender) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.age = age;
        this.weight = weight;
        this.gender = gender;
    }

    async registerUser(res) {
        if (!this.username || !this.password) {
        return res.status(400).send('Username and password are required.');
        }

        const hashedPassword = await bcrypt.hash(this.password, 10);
        await sql.connect(config);
        const result = await sql.query`
        INSERT INTO 
            Users (Username, Password, Email, Age, Weight, Gender)
        VALUES 
                (${this.username}, ${hashedPassword}, ${this.email}, ${this.age}, ${this.weight}, ${this.gender})`;
        return 'User registered successfully!';
    };

static async getUserByUsername(username) {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM Users WHERE Username = ${username}`;
        console.log("logging in")
        console.log(result.recordset)
        if (result.recordset.length > 0) {
            console.log("User found")
            return new User(
                result.recordset[0].Username,
                result.recordset[0].Password,  // Stored as a hash
                result.recordset[0].Email,
                result.recordset[0].Age,
                result.recordset[0].Weight,
                result.recordset[0].Gender
            );
        }
        return null;
    }

    async validatePassword(password) {
        console.log("Stored Hash:", this.password); // Log the stored hash
        console.log("Provided Password:", password); // Log the password to compare
        const match = await bcrypt.compare(password, this.password);
        console.log("Password Match:", match); // Log the result of the comparison
        return match;
    }
    
}




//         const validPassword = await bcrypt.compare(password, user.password);


module.exports = User;