//Creating express server
const express = require("express");
const app = express();
const sql = require('mssql');
const session = require('express-session');
require('dotenv').config();
const config = require('./config');



app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // For parsing application/json

app.use(session({
  secret: 'secret', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: 'auto' } //You need to use a secure cookie in production with HTTPS
}));

const port = 3000;

//Routes
const indexRoutes = require("./routes/indexRoutes");
app.use("/", indexRoutes);

//Listening on the port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });