const fs = require('fs');

require('console-stamp')(console, '[HH:MM:ss.l]');

var express = require('express')
var app = express()

let ejs = require("ejs");

var config = require('./src/ConfigManager');
var RSS = require('./src/RSS');
var DBManager = require('./src/DBManager');
var FileScanner = require('./src/FileScanner');
var Cron = require('./src/Cron');


app.set("view engine", "ejs");
app.set("port", config.options.port);


app.use("/", require("./src/routes"));


app.listen(app.get("port"), () => {
    console.log("The server is running on port:", app.get("port"));
});