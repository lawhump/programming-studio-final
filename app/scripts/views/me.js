var app = app || {};

/**
 * The card in the bottom left corner that represents what you're listening to. 
 */
(function() {
	'use strict';
	app.views.Me = Backbone.View.extend({
		events: {
			'click #cta': 'ctaHandler',
			'click #relocate': 'relocateHandler'
		},

	    initialize: function() {
	    	this.source = $('#me-template').html();
	        this.template = Handlebars.compile(this.source);
	        this.render();
	    },

	    render: function() {
	    	return this;
	    },

	    /**
	     * We have a valid user. Create the card in the bottom left to reflect what the user
	     * is currently listening to.
		 * Client-side call to Last.fm to make it seem like it's always making progress.
	     */
	    createWithUser: function(username) {
	    	console.log('Creating me with user ' + username);
	    	this.username = username;
	    	$('.local-user').removeClass('hidden');
	    	// Last.fm API constants
			var baseURL = 'https://ws.audioscrobbler.com/2.0/?';
			var apiKey 	= 'api_key=3d386c221b36c1442b384aa1d853bc8c';
			var format 	= 'format=json';
			var method 	= 'method=user.getRecentTracks';
			var limit 	= 'limit=1';
			var url = baseURL;
			url += apiKey + '&';
			url += format + '&';
			url += method + '&';
			url += limit + '&';
			url += 'user=' + username;

	    	$.ajax({
		      url: url,
		      data: {
		         key: "value"
		      },
		      error: function() {
		         console.log("something went wrong")
		      },
		      dataType: 'json',
		      success: function(parsed) {
		        var context = {
		        	header: app.Me.username, 
		        	subheader: parsed.recenttracks.track[0].name + ' - ' +  parsed.recenttracks.track[0].artist['#text'],
		        	image: parsed.recenttracks.track[0].image[1]['#text'] || 'http://www.bobjames.com/wp-content/themes/soundcheck/images/default-album-artwork.png',
		        	cta: 'Sign out'
		        };
		        var html = app.Me.template(context);
		        app.Me.$el.append(html);
		        $('#relocate').removeClass('hidden');
		      },
		      type: 'GET'
		   });
	    },

	    /**
	     * No user. Create the card in the bottom left to prompt the user to sign in, if
	     * possible.
	     */
	    createDefault: function() {
	    	console.log('Creating me with default user/sign in prompt');
	    	$('.local-user').removeClass('hidden');
	        var context = {
	        	header: 'Sign in and fit in', 
	        	subheader: 'It is as simple as pressing the "SIGN IN" button.',
	        	image: "http://placehold.it/100x100",
	        	cta: 'Sign in'
	        };
	        var html = this.template(context);
	        app.Me.$el.append(html);
	    },

	    /**
	     * Update card to reflect what I'm currently listening to (in real time)
	     */
	    updateMe: function(parsed) {
	    	console.log(parsed);
	    	var context = {
	        	header: app.Me.username, 
	        	subheader: parsed.recenttracks.track[0].name + ' - ' +  parsed.recenttracks.track[0].artist['#text'],
	        	image: parsed.recenttracks.track[0].image[1]['#text'] || "http://placehold.it/100x100",
	        	cta: 'Sign out'
	        };
	        var html = app.Me.template(context);
	        this.$el.empty();
	        this.$el.append(html);
	        $('#relocate').removeClass('hidden');
	    },

	    /**
	     * The CTA button was pressed (i.e. Sign In or Sign Out).
	     */
	    ctaHandler: function() {
	    	// We're signing in if relocate is hidden
	    	if ($('#relocate').hasClass('hidden')) {
	    		app.LoginView.render();
	    	}

	    	else {
	    		localStorage.clear();
	    		// TODO Send chage to server as well
	    		// Notify the user that they signed out and update Me
	    	}
	    },

	    /**
	     * The Relocate button was pressed.
	     * In production, this will be used for the user to change locations.
	     * For development, it secondaries as a way for me to add new users/neighbors.
	     */
	    relocateHandler: function() {
	    	app.LoginView.render();
	    }
	});
})();