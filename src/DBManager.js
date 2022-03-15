const fs = require('fs');

var events = require('events');
var DBEvents = new events.EventEmitter();

const Database = require('better-sqlite3');
const db = new Database('DB.db', /*{ verbose: console.log }*/);

const FileScan = require('./FileScanner');
var RSS = require('./RSS');


const tableColumns = ["filename", "date", "category"]
const createTable = db.prepare(`CREATE TABLE IF NOT EXISTS files (${tableColumns}, UNIQUE(${tableColumns}))`);
createTable.run();


const insert = db.prepare(`INSERT OR IGNORE INTO files (${tableColumns}) VALUES (@name, @date, @category)`);
const insertMany = db.transaction((files) => {
    for (const file of files) {
        insert.run(file);
    }
    DBEvents.emit("FileScanComplete", files);
});


const REGEX = /(?<category>\w+\/|)(?<YYYY>\d{4})\/(?<MM>\d{2})\/(?<DD>\d{2})\/(?<HH>\d{2}).*.mp3/;

var array = [];
FileScan.mg.on('end', (e) => {
    var Matches;
    for (const filename of e) {
        Matches = filename.toString().match(REGEX).groups;
        Matches.MM = Matches.MM-1;
        if(Matches.category.endsWith('/')) {
            Matches.category = Matches.category.substring(0, Matches.category.length-1);
            // console.log(Matches.category);
        }
        array.push({
            name: (filename.toString().substring(2)),
            date: new Date(Matches.YYYY, Matches.MM-1, Matches.DD, Matches.HH).getTime(),
            category: Matches.category
        });
    }

    insertMany(array);
    var files = db.prepare('SELECT * FROM files').all();
    RSS.BuildFeedFromArray(files);
})

module.exports = {
    DBEvents, db
}