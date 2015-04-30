var express = require('express'),
	config = require('./config'),
	app = express();

app.get('/', function(req, res) {
	res.sendFile(__dirname + config.slidepath);
});

app.use(express.static(__dirname + '/static'));

app.listen(config.server_port);