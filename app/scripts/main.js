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
        }
    };
    
    console.log('initializing app');
    return api; 
})();

/**
 * When page has loaded, fire up backbone and the websocket
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