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
	     * Adding a new user has multiple steps.
	     * 1. Add this new User to Users collection
	     * 2. Update views (feed and map)
	     *   - Feed updates the Map
	     */
	    addUser: function() {
	    	var locationField = document.getElementById('pac-input');
	    	var usernameField = document.getElementById('username');

	    	var location = locationField.value;
	    	var username = usernameField.value;

	    	$('#myModal').modal('hide');

	    	var latlng;
	    	app.Map.locationToLatLng("801 S Lincoln Ave, Urbana, IL 61801, United States")
	    	.then(function(res) {
	    		latlng = res;
	    		var userJSON = JSON.stringify({"user": username, "location": latlng});
	    		app.ws.send(userJSON);

	    	}, function(err) {
	    		console.log('fucked uppppp');
	    	});

	    	// TODO only add if unique
	    	// app.ws.send(userJSON);
	    	// app.Users.add({location: location, username: username});
	    	// app.Feed.updateWithNewUser(username);
	    }
	});
})();