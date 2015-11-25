var WebSocketServer = require("ws").Server;
var http = require("http");
var express = require("express");
var request = require("request");
var app = express();
var port = process.env.PORT || 5000;
// Last.fm API constants
var baseURL = 'http://ws.audioscrobbler.com/2.0/?';
var apiKey 	= 'api_key=3d386c221b36c1442b384aa1d853bc8c';
var format 	= 'format=json';
var method 	= 'method=user.getRecentTracks';
var limit 	= 'limit=1';

// Serve static files from
app.use(express.static(__dirname + "/app"));
app.use(express.static(__dirname + "/app/styles"));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + "/app/scripts"));
app.use(express.static(__dirname + "/app/fonts"));
app.use(express.static(__dirname + "/app/images"));

// Create server and tell which port to listen to
var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

// Plugin for handling multiple socket connections
var wss = new WebSocketServer({server: server, perMessageDeflate: false});
console.log("websocket server created");

// Information of all users who are connected
var usersAPI = {
	// Sample element looks like this
	// {'user': Guapo15, 'location': {'lat': 40, 'lng': 80}, 'song': {{last.fm response}}}
	users: [],

	// Add new user to users and broadcast
	addNewUser: function(user, location) {
		var query = buildQuery(user);
		request.get(query, {}, function(err, res, body) {
			var userInfo = {'user': user, 'location': location, 'song': body};
			usersAPI.users.push(userInfo);
			console.log('Added user.')
			console.log(usersAPI.users);
			wss.broadcast(JSON.stringify(userInfo));
		});
	},
	// Deprecated
	addUser: function(info) {
		this.users.push(info);
		console.log('Added user.')
		console.log(info);
	},
	// Get user's current song and broadcast
	updateUser: function(user) {
		var query = buildQuery(user.user);
		request.get(query, {}, function(err, res, body) {
			user.song = body;
			console.log('Updated user.')
			wss.broadcast(JSON.stringify(user));
		});
	},
	// Used earlier for testing, but still useful so it's hanging around
	reset: function() {
		this.users.length = 0;
	}
};

console.log(usersAPI);

// Return the Last.fm query for this given user
function buildQuery(user) {
	var url = baseURL;
	url += apiKey + '&';
	url += format + '&';
	url += method + '&';
	url += limit + '&';
	url += 'user=' + user;

	return url;
}

// For those just connecting, show every connection prior
wss.showCurrentConnections = function showCurrentConnections(ws) {
	var connections = usersAPI.users;
	console.log(connections);
	for (var index=0; index<connections.length; index++) {
		ws.send(connections[index]);
	}
}

// Transmit data to every client
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};

// The 'upon connection' logic
wss.on("connection", function(ws) {
	console.log("websocket connection open");
	// Show existing connections upon connection
	wss.showCurrentConnections(ws);
	// Every 60 seconds, get users' current song
	setInterval(function() {
		for (var index=0; index<usersAPI.users.length; index++) {
			var user = usersAPI.users[index];
			console.log(user);
			usersAPI.updateUser(user);
		}
	}, 60000);

	ws.on("close", function() {
		console.log("websocket connection close");
	});

	// When the server gets a message from a client
	// Makes the call to Last.fm
  	ws.on('message', function incoming(message, flags) {
	    console.log('received: %s', message);
	    // message is JSON
	    // get the user from message and call Last.fm
	    var parsed = JSON.parse(message);

	    var user = parsed.user;
	    var location = parsed.location;

		usersAPI.addNewUser(user, location);
	});
});

/*(function(){
	console.log('yo');
	// For ever connected user, update self
	for (var index=0; index<usersAPI.users.length; index++) {
		var user = usersAPI.users[index];
		console.log(user);
		usersAPI.updateUser(user);
	}

    setTimeout(arguments.callee, 60000); // every minute and a half or 90 seconds
})();*/