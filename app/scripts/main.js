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
            this.Me = new app.views.Me({el: $('.local-user')});
            if (localStorage.length != 0) {
                // Theoretically this will work most of the time.
                // User is most likely to put themselves in first.
                // Assumption: localStorage preserves order.
                var key = localStorage.key(0);
                var useLoc = localStorage.getItem(key);
                if (useLoc == 'true') {
                    this.showCurrentLocation();
                    var username = key.substring(18);
                    this.Me.createWithUser(username);
                }
            }
            else {
                this.LoginView = new app.views.Login();
            }
            return this;
        },

        /**
         * You know where we are. Show it on the map.
         */
        showCurrentLocation: function() {
            console.log('here');
            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                this.pos = pos;

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
        },

        // Doesn't work yet what's the point of commenting code that I'm not using
        syncClientAndServer: function() {
            if (app.Me.username != undefined) {
                var userJSON = JSON.stringify({"user": app.Me.username, "location": app.pos});
                app.ws.send(userJSON);
            }
        }
    };
    
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
    // app.syncClientAndServer();

    ws.onmessage = function (event) {
        app.Feed.update(event);
    };
});

$('#myModal').on('hidden.bs.modal', function (e) {
    if(!app.LoginView.signedIn){
        app.Me.createDefault();
    }
});
