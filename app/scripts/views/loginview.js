var app = app || {};

/**
 * The modal logic.
 * Used in adding new users.
 */
(function() {
	'use strict';
	app.views.Login = Backbone.View.extend({
	    events: {
	        'click #submit': 'addUser',
	    },

	    el: '#myModal',

	    initialize: function() {
	    	this.song = null;
	        this.render();
	    },

	    render: function() {
			$('#myModal').modal('show');
	    },

	    /**
	     * Just make user and send to server
	     */
	    addUser: function() {
	    	var usernameField = document.getElementById('username');
	    	var username = usernameField.value;

	    	$('#myModal').modal('hide');

	    	var latlng;
	    	app.Map.locationToLatLng(app.Map.place.formatted_address)
	    	.then(function(res) {
	    		latlng = res;
	    		var userJSON = JSON.stringify({"user": username, "location": latlng});
	    		app.ws.send(userJSON);

	    	}, function(err) {
	    		console.log('fucked uppppp');
	    	});

	    	// TODO only add if unique
	    	/*app.ws.send(userJSON);
	    	app.Users.add({location: location, username: username});
	    	app.Feed.updateWithNewUser(username);*/
	    }
	});
})();