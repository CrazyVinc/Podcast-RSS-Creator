var glob = require("glob")
var moment = require("moment");

var config = require('./ConfigManager');

var files = [];
var mg;
function FullScan() {
        mg = new glob('./{*/,/}[0-9][0-9][0-9][0-9]/[0-9][0-9]/[0-9][0-9]/[0-9][0-9]*.mp3',
            {
                cwd: config.options.ArchiveRoot
            },
            function (err, files2) {
            if(err) {
                console.error(err);
                return
            }
            files.push(files2);
        })
}

function FastScan() {
    var date = moment();
        var time = {
            YYYY: date.year(),
            MM: ("0" + (date.month() + 1)).slice(-2),
            DD: ("0" + (date.date())).slice(-2)
        }
        mg = new glob(`./{*/,/}${time.YYYY}/${time.MM}/${time.DD}/[0-9][0-9]*.mp3`,
            {
                cwd: config.options.ArchiveRoot
            },
            function (err, files2) {
            if(err) {
                console.error(err);
                return
            }
            files.push(files2);
        })
}
FullScan();
module.exports = {
    mg, files, FullScan, FastScan
}