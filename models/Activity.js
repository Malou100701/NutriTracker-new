const sql = require('mssql');
const config = require('../config');
const moment = require('moment-timezone');


class Activity {
    constructor(ActivityTypeID, Duration, DateTime) {
        this.ActivityTypeID = ActivityTypeID;
        this.Duration = Duration;
        this.DateTime = DateTime;
    }

    async getUserIdByUsername(username) {
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
    



  
    async logActivity(username) {
        const userID = await this.getUserIdByUsername(username); // NOTE fjern this. tror jeg
        console.log('userID: ' + userID);
        
        await sql.connect(config);

        //Denne kode tilføjer 2 timer til det indsatte DateTime, da serveren ikke befinder sig det samme sted som os, og der derfor er tidsforskel på 2 timer. 
        //Det vil sige, vi kan lave en post request til kl 13:00:00, hvilket normal vil blive til kl. 11 i vores database. Derfor adderer vi med to i vores backend, som indsætter det korrekte i databasen, smart ik?
        //Dog krævede dette at vi installerede npm moment, og requirede den i denne model

        const adjustedDatetime = moment.utc(this.DateTime).add(2, 'hours').format('YYYY-MM-DD HH:mm:ss');

        const request = new sql.Request();
            request.input('UserID', sql.Int, userID);
            console.log('UserID' + userID);
            request.input('ActivityTypeID', sql.Int, this.ActivityTypeID);
            console.log('ActivityTypeID' + this.ActivityTypeID);
            request.input('Duration', sql.Decimal, this.Duration);
            console.log('Duration' + this.Duration);
            request.input('DateTime', sql.DateTime, adjustedDatetime);
            console.log('DateTime' + adjustedDatetime);

        // const time = this.Time.time();
        // console.log('time' + time);
        const result = await request.query(`
            INSERT INTO UserActivities (UserID, ActivityTypeID, Duration, DateTime)
            VALUES (@UserID, @ActivityTypeID, @Duration, @DateTime)
        `);


        console.log('recordset' + result.recordset);    

    }
  
    // Other methods...
  }
  
  module.exports = Activity;