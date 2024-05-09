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
            id: user.UserID,
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



async function deleteUserByUserID(userID) {
    await sql.connect(config);
    const result = await sql.query`DELETE FROM Users WHERE UserID = ${userID}`;
    if (result.rowsAffected[0] > 0) {
        return true;
    }
    return false;
}
module.exports.deleteUserByUserID = deleteUserByUserID;


async function updateUserDetails(userID, newDetails) {
    const { Age, Weight, Gender } = newDetails;
    await sql.connect(config);
    const result = await sql.query`
        UPDATE Users SET Age = ${Age}, Weight = ${Weight}, Gender = ${Gender}
        WHERE UserID = ${userID}`;
    if (result.rowsAffected[0] > 0) {
        return true;
    }
    return false;
}
module.exports.updateUserDetails = updateUserDetails;


async function BMR(UserID) {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('UserID', sql.Int, UserID);
    const query = `SELECT
    Gender,
    Age,
    Weight,
    CASE
        WHEN Gender = 'Kvinde' THEN
            CASE
                WHEN Age < 3 THEN 0.244 * Weight - 0.13
                WHEN Age BETWEEN 4 AND 10 THEN 0.085 * Weight + 2.03
                WHEN Age BETWEEN 11 AND 18 THEN 0.056 * Weight + 2.90
                WHEN Age BETWEEN 19 AND 30 THEN 0.0615 * Weight + 2.08
                WHEN Age BETWEEN 31 AND 60 THEN 0.0364 * Weight + 3.47
                WHEN Age BETWEEN 61 AND 75 THEN 0.0386 * Weight + 2.88
                WHEN Age > 75 THEN 0.0410 * Weight + 2.61
            END
        WHEN Gender = 'Mand' THEN
            CASE
                WHEN Age < 3 THEN 0.249 * Weight - 0.13
                WHEN Age BETWEEN 4 AND 10 THEN 0.095 * Weight + 2.11
                WHEN Age BETWEEN 11 AND 18 THEN 0.074 * Weight + 2.75
                WHEN Age BETWEEN 19 AND 30 THEN 0.064 * Weight + 2.84
                WHEN Age BETWEEN 31 AND 60 THEN 0.0485 * Weight + 3.67
                WHEN Age BETWEEN 61 AND 75 THEN 0.0499 * Weight + 2.93
                WHEN Age > 75 THEN 0.035 * Weight + 3.43
            END
    END AS BMR
FROM
    Users
    WHERE UserID = @UserID
    ;`;
    const result = await request.query(query);
    const kCal = result.recordset[0].BMR * 238.8458966275;
    return kCal

}
module.exports.BMR = BMR;


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