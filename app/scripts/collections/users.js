/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Users Collection
	// ---------------

	// The collection of users is backed by *localStorage* instead of a remote
	// server.
	var Users = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.models.User,

		// We keep the Users in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			return this.length ? this.last().get('order') + 1 : 1;
		},

		updateWithNewComment: function() {
			console.log('fuck');
			app.CommitInfoView.render();
		},

		// Users are sorted by their original insertion order.
		comparator: 'order'
	});

	// Create our global collection of **Users**.
	app.Users = new Users();
	// app.Users.bind('add', app.Feed.updateWithNewUser());
	console.log('initializing users collection');
})();
