const sql = require('mssql');
const config = require('../config');
const bcrypt = require('bcrypt')

async function registerUser(username, password, email, age, weight, gender, res) {
    if (!username || !password) {
        return res.status(400).send('Username and password are required.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await sql.connect(config);
    await sql.query`
        INSERT INTO Users (Username, Password, Email, Age, Weight, Gender)
        VALUES (${username}, ${hashedPassword}, ${email}, ${age}, ${weight}, ${gender})`;
    return 'User registered successfully!';
}
module.exports.registerUser = registerUser;

async function getUserByUsername(username) {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM Users WHERE Username = ${username}`;
    if (result.recordset.length > 0) {
        const user = result.recordset[0];
        console.log("User found:", user);
        return {
            username: user.Username,
            password: user.Password,
            email: user.Email,
            age: user.Age,
            weight: user.Weight,
            gender: user.Gender
        };
    }
    return null;
}

module.exports.getUserByUsername = getUserByUsername;

async function validatePassword(userPassword, password) {
    const match = await bcrypt.compare(password, userPassword);
    console.log("Password Match:", match);
    return match;
}
module.exports.validatePassword = validatePassword;



async function deleteUserByUsername(username) {
    await sql.connect(config);
    const result = await sql.query`DELETE FROM Users WHERE Username = ${username}`;
    if (result.rowsAffected[0] > 0) {
        return true;
    }
    return false;
}
module.exports.deleteUserByUsername = deleteUserByUsername;


async function updateUserDetails(username, newDetails) {
    const { Age, Weight, Gender } = newDetails;
    await sql.connect(config);

    const result = await sql.query`
        UPDATE Users SET Age = ${Age}, Weight = ${Weight}, Gender = ${Gender}
        WHERE Username = ${username}`;
    console.log("Update result:", result);
    if (result.rowsAffected[0] > 0) {
        return true;
    }
    return false;
}

module.exports.updateUserDetails = updateUserDetails;

/*
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
        console.log("User found:", result.recordset);
        if (result.recordset.length > 0) {
            console.log("User found:", result.recordset[0]);
            return new User(
                result.recordset[0].Username,
                result.recordset[0].Password,  
                result.recordset[0].Email,
                result.recordset[0].Age,
                result.recordset[0].Weight,
                result.recordset[0].Gender
            );
        }
        return null;
    }
    

    async validatePassword(password) {
        const match = await bcrypt.compare(password, this.password);
        console.log("Password Match:", match); // Log the result of the comparison
        return match;
    }

    static async deleteUserByUsername(username) {
        await sql.connect(config);
        const result = await sql.query`DELETE FROM Users WHERE Username = ${username}`;
        if (result.rowsAffected[0] > 0) {
            return true; // User deleted successfully
        }
        return false; // No user found with that username
    }
    

    static async updateUserDetails(username, newDetails) {
        const { Age, Weight, Gender } = newDetails;
        await sql.connect(config);
        
        console.log("SQL Query:", `UPDATE Users SET Age = ${Age}, Weight = ${Weight}, Gender = ${Gender} WHERE Username = ${username}`);


        const result = await sql.query`
            UPDATE Users 
            SET Age = ${Age}, Weight = ${Weight}, Gender = ${Gender}
            WHERE Username = ${username}`;
        console.log("Update result:", result);
        if (result.rowsAffected[0] > 0) {
            return true; // User details updated successfully
        }
        return false; // No user found with that username
    }
    

}







//         const validPassword = await bcrypt.compare(password, user.password);


module.exports = User;
*/