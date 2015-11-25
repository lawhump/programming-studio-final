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
        localStorePrefix: 'whisperingJourney-',
        views: {},
        models: {},
        collections: {},

		LoginView: null,

        init: function() {
            if (localStorage.length != 0) {
                // Theoretically this will work most of the time.
                // User is most likely to put themselves in first.
                // Assumption: localStorage preserves order.
                var useLoc = localStorage.getItem(localStorage.key(0));
                // console.log(useLoc);
                if (useLoc === true || useLoc == 'true') {
                    this.showCurrentLocation();
                }
            }
            this.LoginView = new app.views.Login();
            return this;
        },

        showCurrentLocation: function() {
            console.log('here');
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                app.Map.map.setCenter(pos);
                app.Map.map.setZoom(17);
            }, function() {
                handleLocationError(true, app.Map.map.getCenter());
                });
            } 

            else {
                // Browser doesn't support Geolocation
                handleLocationError(false, app.Map.map.getCenter());
            }
        },

        handleLocationError: function(browserHasLocation, pos) {
            console.log(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
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
	app.LoginView.render();
});
