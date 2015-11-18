var app = app || {};

/**
 * Logic for map. Includes all drawing and updating and initializing the map.
 */
(function() {
	'use strict';
	app.views.Map = Backbone.View.extend({
		el: '#map',

	    events: { },


	    initialize: function() {
	    	this.infowindow = null;
	    	this.infowindows = [];
	        this.place = null;
	        this.marker = null;
	        this.markers = [];
	        this.map = null;
	        this.image = 'images/user.png';
	    	this.initMap();
		},

		// All of this logic is near copy/pasted from a Google Maps API example.
		// Tweaked slightly.
		initMap: function() {
			this.map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 40.1058647, lng: -88.2193354},
				streetViewControl: false,
				zoom: 13
			});
			var input = /** @type {!HTMLInputElement} */(
				document.getElementById('pac-input'));

			var types = document.getElementById('type-selector');
			// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
			this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

			var autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.bindTo('bounds', this.map);

			this.infowindow = new google.maps.InfoWindow();
			this.marker = new google.maps.Marker({
				icon: this.image,
				map: this.map,
				anchorPoint: new google.maps.Point(0, -29)
			});

			autocomplete.addListener('place_changed', function() {
				app.Map.infowindow.close();
				app.Map.marker.setVisible(false);
				app.Map.place = autocomplete.getPlace();
				if (!app.Map.place.geometry) {
					window.alert("Autocomplete's returned place contains no geometry");
					return;
				}

				// If the place has a geometry, then present it on a map.
				if (app.Map.place.geometry.viewport) {
					app.Map.map.fitBounds(app.Map.place.geometry.viewport);
				} 

				else {
					app.Map.map.setCenter(app.Map.place.geometry.location);
					app.Map.map.setZoom(17);  // Why 17? Because it looks good.
				}
			});	
		},

		/**
		 * Called after another user is added.
		 * Updates the map to show that another user is listening to something in
		 * the proximity.
		 * Again, most of this is copy/pasted and tweaked slightly.
		 */
		updateMap: function(user) {
			console.log('in updateMap');
			console.log(user);
			console.log(this.infowindows);
			console.log(this.markers);

			var index = -1;
			// if user is already on the map
			for (var i = this.infowindows.length - 1; i >= 0; i--) {
				if(this.infowindows[i].content.includes(user.user)) {
					index = i;
				}
			}

			// if user not on map
			if (index < 0) {
				this.addUser(user);
			}

			else {
				this.updateUser(user, index);
			}
		},

		/**
		 * Convert the string representation of the address to latitude and longitude
		 */
		locationToLatLng: function(location) {
			console.log(location);
			var deferred = $.Deferred(),
			 geocoder = new google.maps.Geocoder();

			geocoder.geocode({"address": location}, function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					console.log(results);
					//In this case it creates a marker, but you can get the lat and lng from the location.LatLng
					var latlng = {"lat": results[0].geometry.location.lat(), "lng": results[0].geometry.location.lng()};
					deferred.resolve(latlng);
				} 

				else {
					alert("Geocode was not successful for the following reason: " + status);
					deferred.reject(status);
				}
			});
			return deferred.promise();
		},

		addUser: function(user) {
			var parsedSong = JSON.parse(user.song);

			var albumArt = parsedSong.recenttracks.track[0].image[1]['#text'];
			var songTitle = parsedSong.recenttracks.track[0].name;

			var marker;
			if (this.place != null) {
				marker = new google.maps.Marker({
		            position: this.place.geometry.location || user.location,
		            map: this.map
		        });
			}

			else {
				marker = new google.maps.Marker({
		            position: user.location,
		            map: this.map
		        });
			}
	        
			marker.setIcon(/** @type {google.maps.Icon} */({
				url: albumArt,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(50, 50)
			}));

			this.markers.push(marker);

			var i;
			var infowindow = new google.maps.InfoWindow();
	        // Allow each marker to have an info window    
	        // google.maps.event.addListener(marker, 'click', (function(marker, i) {
	        //     return function() {
	        //         infoWindow.setContent(this.infowindows[i][0]);
	        //         infoWindow.open(map, marker);
	        //     }
	        // })(marker, i));

			// console.log(this.place.geometry.location);
			// var loc = this.place.geometry.location;

			marker.setPosition(new google.maps.LatLng(user.location));
			// this.marker.setPosition(new google.maps.LatLng({lat: loc.lat()+Math.random()/100000, lng: loc.lng()+Math.random()/100000}));
			// this.marker.setPosition(this.place.geometry.location);
			marker.setVisible(true);
			
			infowindow.setContent('<div><strong>' + user.user + '</strong><br>' + songTitle);
			infowindow.open(this.map, marker);
			this.infowindows.push(infowindow);
		},

		updateUser: function(user, index) {
			var parsedSong = JSON.parse(user.song);

			var albumArt = parsedSong.recenttracks.track[0].image[1]['#text'];
			var songTitle = parsedSong.recenttracks.track[0].name;

			var marker = this.markers[index];
	        
			marker.setIcon(/** @type {google.maps.Icon} */({
				url: albumArt,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(50, 50)
			}));

			var i;
			var infowindow = this.infowindows[index];

			marker.setPosition(new google.maps.LatLng(user.location));
			// this.marker.setPosition(new google.maps.LatLng({lat: loc.lat()+Math.random()/100000, lng: loc.lng()+Math.random()/100000}));
			// this.marker.setPosition(this.place.geometry.location);
			marker.setVisible(true);
			
			infowindow.setContent('<div><strong>' + user.user + '</strong><br>' + songTitle);
			infowindow.open(this.map, marker);
		}
	});

	app.Map = new app.views.Map();
})();