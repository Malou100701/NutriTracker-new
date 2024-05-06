const sql = require('mssql');
const config = require('../config');
const moment = require('moment-timezone');




    async function getUserIdByUsername(username) {
            await sql.connect(config);
            const request = new sql.Request();
            request.input('Username', sql.VarChar, username);
            const query = `SELECT UserID FROM Users WHERE Username = @Username`;
            const result = await request.query(query);
    
            if (result.recordset.length === 0) {
                throw new Error('User not found');
            }
    
            return result.recordset[0].UserID;
    }
    



  
    async function logActivity(userID, activityTypeID, duration, dateTime) {
console.log('logActivity');
        
        await sql.connect(config);

        //Denne kode tilføjer 2 timer til det indsatte DateTime, da serveren ikke befinder sig det samme sted som os, og der derfor er tidsforskel på 2 timer. 
        //Det vil sige, vi kan lave en post request til kl 13:00:00, hvilket normal vil blive til kl. 11 i vores database. Derfor adderer vi med to i vores backend, som indsætter det korrekte i databasen, smart ik?
        //Dog krævede dette at vi installerede npm moment, og requirede den i denne model

        const adjustedDatetime = moment.utc(dateTime).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

        const request = new sql.Request();
            request.input('UserID', sql.Int, userID);
            console.log('UserID' + userID);
            request.input('ActivityTypeID', sql.Int, activityTypeID);
            console.log('ActivityTypeID' + activityTypeID);
            request.input('Duration', sql.Decimal, duration);
            console.log('Duration' + duration);
            request.input('DateTime', sql.DateTime, adjustedDatetime);
            console.log('DateTime' + adjustedDatetime);

        // const time = this.Time.time();
        // console.log('time' + time);
        const result = await request.query(`
            INSERT INTO UserActivity (UserID, ActivityTypeID, Duration, DateTime)
            VALUES (@UserID, @ActivityTypeID, @Duration, @DateTime)
        `);


        console.log('recordset' + result.recordset);    

    }
  module.exports.logActivity = logActivity;

    async function getActivities() {
        console.log('getActivities');
        await sql.connect(config);
        const query = `SELECT ActivityTypeID, ActivityName 
        FROM ActivityType 
`;
        const result = await sql.query(query);
        return result.recordset;
    }
    module.exports.getActivities = getActivities;
