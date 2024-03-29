var app = app || {};

/**
 * The feed view. 
 */
(function() {
	'use strict';
	app.views.Feed = Backbone.View.extend({
	    events: { },

	    initialize: function() {
	    	this.res = null;
	        this.render();
	    },

	    render: function() {
	    	return this;
	    },

	    /**
	     * A new user has been added. Put user informaion in the feed 
	     * and tell map to update.
	     */
	    update: function(user) {
	    	console.log(user);
	    	if (user.data.length > 0) {
		    	var parsed = JSON.parse(user.data);
		    	var parsedSong = JSON.parse(parsed.song);

		    	var source = $('#feed-template').html();
		        var template = Handlebars.compile(source);
		        var context = {
		        	user: parsed.user, 
		        	song: parsedSong.recenttracks.track[0].name, 
		        	artist: parsedSong.recenttracks.track[0].artist['#text'],
		        	cover: parsedSong.recenttracks.track[0].image[1]['#text'] || "http://placehold.it/75x75"
		        };
		        var html = template(context);

		        // Search the DOM for elements with id=parsed.user
		        // If non-empty, this person exists, so just update it
		        var $feedItem = $('#'+parsed.user);

		        if (app.Me.username != undefined) {
			        if ($feedItem.length != 0) {
			        	$feedItem.replaceWith(html);
			        }

			        else if (parsed.user.toLowerCase() == app.Me.username.toLowerCase()) {
			        	app.Me.updateMe(parsedSong);
			        }

			        else {
				        app.Feed.$el.append(html);
				    }
			        app.Map.updateMap(parsed);
			    }
		    }
	    }

	    /*updateWithNewUser: function(user) {
	    	var req = app.getCurrentlyPlaying(user);
	    	req.done(function(res) {
	    		console.log(res);
	    		this.res = res;
	    		app.LoginView.song = this.res;

	    		var source = $('#feed-template').html();
		        var template = Handlebars.compile(source);
		        var context = {user: user, song: this.res.recenttracks.track[0].name, artist: this.res.recenttracks.track[0].artist['#text']};
		        var html = template(context);

		        app.Feed.$el.append(html);
		        app.Map.updateMap(res);
	    	})
	    	.fail(function() {
	    		console.log('you really cussed up');
	    	});
	    }*/
	});
	app.Feed = new app.views.Feed({el: $('.feed')});
})();