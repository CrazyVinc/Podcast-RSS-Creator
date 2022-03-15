var path = require("path");
const fs = require("fs");
const {
    promises: { readdir },
} = require("fs");


var express = require("express");
var app = express.Router();

var config = require('../ConfigManager');
var RSS = require('../RSS');

const getDirectories = async (source) => 
    (await readdir(source, { withFileTypes: true }))
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);

const getFiles = async (source) =>
    (await readdir(source, { withFileTypes: true }))
            .filter((dirent) => dirent.isFile())
            .map((dirent) => dirent.name);

app.get("/rss", async function (req, res) {
    res.set('Content-Type', 'text/xml');
    res.send(RSS.RSS.cache);
});

app.get(":category(/[a-z]+|)/", async function (req, res) {
    if(!config.options.FilesBrowserble) {
        res.send({"error": "The archive is not browsable! Please contact the site administration if you believe this is a error."});
        return;
    }
    res.render("YYYY", {
        Years: await getDirectories(config.options.ArchiveRoot+req.params.category),
        url: req.baseUrl
    });
});

app.get(":category(/[a-z]+|)/:YYYY([0-9]{4})", async function (req, res) {
    if(!config.options.FilesBrowserble) {
        res.send({"error": "The archive is not browsable! Please contact the site administration if you believe this is a error."});
        return;
    }
    res.render("MM", {
        Months: await getDirectories(config.options.ArchiveRoot+req.params.category+"/"+req.params.YYYY),
        Selected: {
            YYYY: req.params.YYYY
        },
        url: req.baseUrl
    });
});

app.get(":category(/[a-z]+|)/:YYYY([0-9]{4})/:MM([0-9]{2})", async function (req, res) {
    if(!config.options.FilesBrowserble) {
        res.send({"error": "The archive is not browsable! Please contact the site administration if you believe this is a error."});
        return;
    }
    res.render("DD", {
        Days: await getDirectories(config.options.ArchiveRoot+req.params.category+"/"+req.params.YYYY+"/"+req.params.MM),
        Selected: {
            YYYY: req.params.YYYY,
            MM: req.params.MM
        },
        url: req.baseUrl
    });
});
app.get(":category(/[a-z]+|)/:YYYY([0-9]{4})/:MM([0-9]{2})/:DD([0-9]{2})", async function (req, res) {
    if(!config.options.FilesBrowserble) {
        res.send({"error": "The archive is not browsable! Please contact the site administration if you believe this is a error."});
        return;
    }
    res.render("audio", {
        Days: await getFiles(config.options.ArchiveRoot+req.params.category+"/"+req.params.YYYY+"/"+req.params.MM+"/"+req.params.DD),
        Selected: {
            YYYY: req.params.YYYY,
            MM: req.params.MM,
            DD: req.params.DD
        },
        url: req.baseUrl
    });
});

app.get(":category(/[a-z]+|)/:YYYY([0-9]{4})/:MM([0-9]{2})/:DD([0-9]{2})/:mp3", async function (req, res) {
    var RecPath = config.options.ArchiveRoot+req.params.category+"/"+req.params.YYYY+"/"+req.params.MM+"/"+req.params.DD+"/"+req.params.mp3;
    if(fs.existsSync(RecPath)) {
        res.sendFile(path.resolve(RecPath))
    } else {
        res.status(404).render("errors", { error: { code: 404 } });
    }
});

app.get("*", function (req, res) {
    res.status(404).render("errors", { error: { code: 404 } });
});

module.exports = app;