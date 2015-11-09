/**
 * This serves as the core for all the backbone interactions.
 */
var app = (function() {
 
 	/**
	 * Caused a great deal of confusion the first time I worked with
	 * backbone, but views, models, and collections serve as a template 
	 * for building your models, views, and collections and not the Ms,
	 * Vs, or Cs in themselves. Rookie mistake, I know.
	 */
    var api = {
        views: {},
        models: {},
        collections: {},

		LoginView: null,

        init: function() {
        	this.LoginView = new app.views.Login();
            return this;
        },

        /**
         * Makes call to Last.fm API
         * Returns jQuery deffered object signifying the Last.fm response
         */
        getCurrentlyPlaying: function(user) {
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

			return $.ajax({
				url: url,
				method: 'GET',
				dataType: 'JSON'
			});
        }
    };
    
    console.log('initializing app');
    return api; 
})();

/**
 * When page has loaded, fire up backbone.
 */
$(document).ready(function() {
	app.init();
    var host = location.origin.replace(/^http/, 'ws')
    var ws = new WebSocket(host);
    app.ws = ws;
    ws.onmessage = function (event) {
        app.Feed.update(event);
    };
});

/**
 * I know this seems out of place, but that's because I didn't want to define a new 
 * backbone component with such little logic.
 * 
 * Event listener for the FAB - floating action button. When clicked, just display the
 * modal used for inputting place and username.
 */
$('.fab').on('click', function() {
    // Send data to server
	app.LoginView.render();
});