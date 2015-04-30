var WebSocketServer = require('ws').Server,
    config = require('./config'),
    wss = new WebSocketServer({ port: config.websocket_port });

//broadcast msg. Send to everyone but not to self
wss.broadcast = function broadcast(sender, data) {
	wss.clients.forEach(function each(client) {
		if (sender != client)
			client.send(data);
	});
};

wss.on('connection', function(ws) {
	console.log('new user connected. Total ' + wss.clients.length);
	ws.on('message', function(message) {
		var data = JSON.parse(message);
		//check if pattern match and broadcast msg if source is the host
		if ('src' in data && 'command' in data) {
			if (data.src === config.host) {
				data.src = 'sys';
				wss.broadcast(this, JSON.stringify(data));
			}
		}
	});

	ws.on('close', function(ws) {
		console.log('user left. Total: ' + wss.clients.length);
	});
});

console.log('ready on port ' + config.websocket_port);