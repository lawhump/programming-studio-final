/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.collections.Users = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.models.User,
		url: '/index,',

		parse: function(res) {}
	});

	app.Users = new app.collections.Users();
})();
