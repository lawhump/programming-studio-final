/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	app.collections.Clusters = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.models.Cluster,

		parse: function(res) {}
	});

	app.Clusters = new app.collections.Clusters();
})();
