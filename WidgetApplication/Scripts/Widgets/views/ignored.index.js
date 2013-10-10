define('IgnoredWidgetListView', [
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'text!widgets/templates/ignored.index.html',
	'IgnoredWidgetCollection'
], function($, _, Backbone, moment, tpl, IgnoredWidgetCollection) {
	var IgnoredWidgetListView;

	IgnoredWidgetListView = Backbone.View.extend({
		initialize: function() {
			
			this.template = _.template(tpl);
			this.collection = new IgnoredWidgetCollection();
			//this.collection.bind('all',   this.render, this);
		},
		events: {
			"click .add-btn": "addToSelectedWidget"
		},
		// render template after data refresh
		render: function(callback) {
			var that = this, tmpl;

			this.getData(function(collection) {
				tmpl = that.template({ ignoredWidgets: collection.toJSON() });
				$(that.el).html(tmpl);
				if(callback != null)
					callback();
			});
		},
		addToSelectedWidget: function (e) {
			var that, tmpl;
			that = this;
			var id = $(e.target).attr("id_attr");
			var removedModel = that.collection.get(id);
			that.collection.remove(removedModel);
			tmpl = that.template({ ignoredWidgets: that.collection.toJSON() });
			$(that.el).html(tmpl);
			this.trigger('add-to-selected-success', removedModel);
		},
		// render template after data refresh
		addWidget: function (addingModel, callback) {
			var that = this, tmpl;

			that.collection.add(addingModel);
			tmpl = that.template({ ignoredWidgets: that.collection.toJSON() });
			$(that.el).html(tmpl);
			
			if (callback != null)
				callback();
		},
		getData: function(callback) {
			this.collection.fetch({
				success: function (collection) {
					if (callback!=null)
						callback(collection);
				},
				error: function(coll, res) {
					if (res.status === 404) {
						// TODO: handle 404 Not Found
					} else if (res.status === 500) {
						// TODO: handle 500 Internal Server Error
					}
				}
			});
		}
	
	});

	return IgnoredWidgetListView;
});
