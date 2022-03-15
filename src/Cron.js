const CronJob = require("cron");

var config = require('./ConfigManager');
var RSS = require('./RSS');
const FileScan = require('./FileScanner');
const DB = require('./DBManager');


var FullScan = new CronJob.CronJob(
    config.options.CronJobs.FullRescan,
    function () {
        FileScan.FullScan();
        DB.DBEvents.once('FileScanComplete', () => {
            var files = DB.db.prepare('SELECT * FROM files').all();
            RSS.feed.items = [];
            RSS.BuildFeedFromArray(files);
            RSS.RSS.rebuild();
        });
}, null, true, null, null, true);

var GenerateCache = new CronJob.CronJob(
    config.options.CronJobs.RebuildCache,
    function () {
        FileScan.FastScan();
        DB.DBEvents.once('FileScanComplete', () => {
            var files = DB.db.prepare('SELECT * FROM files').all();
            RSS.feed.items = [];
            RSS.BuildFeedFromArray(files);
            RSS.RSS.rebuild();
        })
}, null, true, null, null, false);

module.exports = {
    FullScan, GenerateCache
}