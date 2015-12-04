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
	        'click #remember-user': 'checkboxClicked',
	        'keypress #username': 'keypressHandler'
	    },

	    el: '#myModal',

	    initialize: function() {
	    	// Deprecated?
	    	this.song = null;
	    	this.locCheckbox = document.getElementById('remember-location');
	    	this.usrCheckbox = document.getElementById('remember-user');
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
	    		if (app.Me.username == undefined) {
		    		app.Me.username = username;
		    		app.Me.createWithUser(username);
		    	}
	    		app.ws.send(userJSON);

	    	}, function(err) {
	    		console.log('cussed uppppp');
	    	});

	    	if (this.usrCheckbox.checked) {
	    		// Enforce only one entry in localStorage
	    		localStorage.clear();
	    		if (this.locCheckbox.checked) {
	    			localStorage[app.localStorePrefix+username.toLowerCase()] = true;
	    		}
	    		else {
		    		localStorage[app.localStorePrefix+username.toLowerCase()] = false;
		    	}
	    	}
	    },

	    checkboxClicked: function() {
	    	if (document.getElementById('remember-user').checked) {
	    		$('#remember-location').removeClass('hidden');
	    		$('#remember-location').parent().removeClass('hidden');
	    	}
	    	else {
	    		$('#remember-location').addClass('hidden');	
	    		$('#remember-location').parent().addClass('hidden');	
	    	}
	    },

	    keypressHandler: function(e) {
	    	var code = (e.keyCode ? e.keyCode : e.which);
			if(code == 13) { //Enter keycode
				this.addUser();
			}
	    }
	});
})();