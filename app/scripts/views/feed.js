var app = app || {};

/**
 * The map view. 
 */
(function() {
	'use strict';
	app.views.Feed = Backbone.View.extend({
	    events: {
	        
	    },

	    initialize: function() {
	    	this.res = null;
	        this.render();
	    },

	    render: function() {
	    	return this;
	    },

	    update: function(user) {
	    	var parsed = JSON.parse(user.data);
	    	var parsedSong = JSON.parse(parsed.song);

	    	var source = $('#feed-template').html();
	        var template = Handlebars.compile(source);
	        var context = {user: parsed.user, song: parsedSong.recenttracks.track[0].name, artist: parsedSong.recenttracks.track[0].artist['#text']};
	        var html = template(context);

	        app.Feed.$el.append(html);
	        app.Map.updateMap(parsed);
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