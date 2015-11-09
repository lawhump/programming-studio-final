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
	        this.place = null;
	        this.marker = null;
	        this.image = 'images/user.png';
	    	this.initMap();
		},

		// All of this logic is near copy/pasted from a Google Maps API example.
		// Tweaked slightly.
		initMap: function() {
			var map = new google.maps.Map(document.getElementById('map'), {
				center: {lat: 40.1058647, lng: -88.2193354},
				streetViewControl: false,
				zoom: 13
			});
			var input = /** @type {!HTMLInputElement} */(
				document.getElementById('pac-input'));

			var types = document.getElementById('type-selector');
			// map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
			map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

			var autocomplete = new google.maps.places.Autocomplete(input);
			autocomplete.bindTo('bounds', map);

			this.infowindow = new google.maps.InfoWindow();
			this.marker = new google.maps.Marker({
				icon: this.image,
				map: map,
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
					map.fitBounds(app.Map.place.geometry.viewport);
				} else {
					map.setCenter(app.Map.place.geometry.location);
					map.setZoom(17);  // Why 17? Because it looks good.
				}
			});	
		},

		/**
		 * Called after another user is added.
		 * Updates the map to show that another user is listening to something in
		 * the proximity.
		 * Again, most of this is copy/pasted and tweaked slightly.
		 */
		// updateMap: function(response) {
		// 	console.log(response);

		// 	var albumArt = response.recenttracks.track[0].image[1]['#text'];

		// 	console.log(albumArt);

		// 	this.marker.setIcon(/** @type {google.maps.Icon} */({
		// 		url: albumArt,
		// 		size: new google.maps.Size(71, 71),
		// 		origin: new google.maps.Point(0, 0),
		// 		anchor: new google.maps.Point(17, 34),
		// 		scaledSize: new google.maps.Size(50, 50)
		// 	}));

		// 	console.log(this.place.geometry.location);

		// 	var loc = this.place.geometry.location;

		// 	this.marker.setPosition(new google.maps.LatLng({lat: loc.lat()+Math.random()/100000, lng: loc.lng()+Math.random()/100000}));
		// 	// this.marker.setPosition(this.place.geometry.location);
		// 	this.marker.setVisible(true);

		// 	var address = '';
		// 	if (this.place.address_components) {
		// 		address = [
		// 			(this.place.address_components[0] && this.place.address_components[0].short_name || ''),
		// 			(this.place.address_components[1] && this.place.address_components[1].short_name || ''),
		// 			(this.place.address_components[2] && this.place.address_components[2].short_name || '')
		// 		].join(' ');
		// 	}

		// 	// this.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
		// 	this.infowindow.open(map, this.marker);
		// }

		updateMap: function(user) {
			console.log(user);
			var parsedSong = JSON.parse(user.song);

			var albumArt = parsedSong.recenttracks.track[0].image[1]['#text'];

			console.log(albumArt);

			this.marker.setIcon(/** @type {google.maps.Icon} */({
				url: albumArt,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(50, 50)
			}));

			// console.log(this.place.geometry.location);
			// var loc = this.place.geometry.location;

			this.marker.setPosition(user.location);
			// this.marker.setPosition(new google.maps.LatLng({lat: loc.lat()+Math.random()/100000, lng: loc.lng()+Math.random()/100000}));
			// this.marker.setPosition(this.place.geometry.location);
			this.marker.setVisible(true);

			var address = '';
			if (this.place.address_components) {
				address = [
					(this.place.address_components[0] && this.place.address_components[0].short_name || ''),
					(this.place.address_components[1] && this.place.address_components[1].short_name || ''),
					(this.place.address_components[2] && this.place.address_components[2].short_name || '')
				].join(' ');
			}

			// this.infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
			this.infowindow.open(map, this.marker);
		}
	});

	app.Map = new app.views.Map();
})();