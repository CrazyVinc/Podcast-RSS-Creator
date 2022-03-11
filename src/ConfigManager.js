const fs = require('fs');
var path = require('path');

var path2 = path.resolve(__dirname+"/..");
var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

function Reload() {
    config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
}

function save() {
    var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
	fs.writeFile(path2+'/config.json', config.toString(), function (err) {
		if (err) console.warn(err);
		config.loadFile(path2+'/config.json');
	});
}


module.exports = {
    Reload, save, options: config
}