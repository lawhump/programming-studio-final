/*global Portfolio, Backbone*/
var app = app || {};

/**
 * Model representing a User.
 * Location is where they are when they logged in
 * Username is their Last.fm username
 */
(function () {
    'use strict';
    app.models.User = Backbone.Model.extend({
    	location: null,
    	username: 'Guapo15',
    	song: {},

		init: function() {}

    });
    app.User = new app.models.User();
})();
