var app = app || {};

/**
 * Model representing an 'infowindow'.
 * Will contain the actual Google infowindow, as well as a 
 */
(function () {
    'use strict';
    app.models.Cluster = Backbone.Model.extend({
    	location: null,
    	users: [],
    	infowindow: null,
    	marker: null,

		init: function() {},

		addUser: function() {},

		removeUser: function() {},

    });
})();