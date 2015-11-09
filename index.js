var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var request = require("request");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/app"));
app.use(express.static(__dirname + "/app/styles"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + "/app/scripts"));
app.use(express.static(__dirname + "/app/fonts"));
app.use(express.static(__dirname + "/app/images"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

var wss = new WebSocketServer({server: server});
console.log("websocket server created");


var usersAPI = {
	users: [],

	listUsers: function() {
		return this.users;
	},
	addUser: function(info) {
		this.users.push(info);
		console.log('Added user.')
		console.log(info);
	},
	reset: function() {
		this.users.length = 0;
	}
};

console.log(usersAPI);

wss.showCurrentConnections = function showCurrentConnections(ws) {
	var connections = usersAPI.users;
	console.log(connections);
	for (var index=0; index<connections.length; index++) {
		ws.send(connections[index] );
	}
}

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

wss.on("connection", function(ws) {
	console.log("websocket connection open");
	wss.showCurrentConnections(ws);

	ws.on("close", function() {
		console.log("websocket connection close");
	});

  	ws.on('message', function incoming(message, flags) {
	    console.log('received: %s', message);
	    // message is JSON
	    // get the user from message and call Last.fm
	    var parsed = JSON.parse(message);

	    var user = parsed.user;
	    var location = parsed.location;

	    var baseURL = 'http://ws.audioscrobbler.com/2.0/?';
		var apiKey 	= 'api_key=3d386c221b36c1442b384aa1d853bc8c';
		var format 	= 'format=json';
		var method 	= 'method=user.getRecentTracks';
		var limit 	= 'limit=1';

		var url = baseURL;
		url += apiKey + '&';
		url += format + '&';
		url += method + '&';
		url += limit + '&';
		url += 'user=' + user;

		request.get(url, {}, function(err, res, body) {
			// console.log(body);

			var userInfo = {'user': user, 'location': location, 'song': body};
			usersAPI.addUser(userInfo);
			wss.broadcast(JSON.stringify(userInfo));
		});
	});
});