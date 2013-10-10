define('WidgetListView', [
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'WidgetCollection',
	'WidgetView',
	'jquery-ui'
], function ($, _, Backbone, moment, WidgetCollection, WidgetView) {
	var WidgetListView;
	var widgetViewCollection;
	var editMode;
	
	WidgetListView = Backbone.View.extend({
		initialize: function (options) {
			if (options) {
				if(options.collection)
					this.collection = options.collection;
				else {
					this.collection = new WidgetCollection();
				}
				if (options.editMode)
					this.editMode = options.editMode;
			} else {
				this.collection = new WidgetCollection();
				this.editMode = false;
			}
		},
		events: {
			'click .remove-btn': 'removeFromSelectedWidgets'
		},
		bind: function () {
			var tmpl, that;
			that = this;
			$(that.el).html('');
			$.each(that.collection.toJSON(), function () {
				var widget = this;
				if (!that.widgetViewCollection)
					that.widgetViewCollection = [];

				var widgetView = _.find(that.widgetViewCollection, function (obj) { return obj.model.Id == widget.Id; });
			
				if (!widgetView) {
					widgetView = new WidgetView({ model: widget, editMode: that.editMode });
					that.widgetViewCollection.push(widgetView);
				}

				widgetView.render(function (widgetEl) {
					$(that.el).append(widgetEl);
				});
				
				if(that.editMode)
					that.setSortable();
			});
		},
		// render template after data refresh
		render: function (callback, collection) {
			var that = this;
			if (!collection) {
				that.getData(function (coll) {
					that.collection = coll;
					that.bind();
				});
			} else {
				that.collection = collection;
				that.bind();
			}
			if (callback != null)
				callback();

		},
		getData: function (callback) {
			this.collection.fetch({
				success: function (collection) {
					if (callback != null)
						callback(collection);
				},
				error: function (coll, res) {
					if (res.status === 404) {
						// TODO: handle 404 Not Found
					} else if (res.status === 500) {
						// TODO: handle 500 Internal Server Error
					}
				}
			});
		},
		setSortable: function (e) {
			$('#selected_widgets').sortable({
				cursor: 'move',
				//		distance: 5,
				opacity: 0.6,
				items: " div[name=widget_table]",
				update: function (event, ui) {
					var widgetDataSortable = $(this).sortable('toArray', { attribute: 'id_attr' }).toString();
					//$.get('update-sort.cfm', { marketDataOrder: marketDataOrder });
				}
			});
		},
		removeFromSelectedWidgets: function (e) {
			var that, tmpl;
			that = this;
			var id = $(e.target).attr("id_attr");
			var removedModel = that.collection.get(id);
			that.collection.remove(removedModel);
			that.render(function () {
				that.trigger('add-to-ignored-success', removedModel);
			}, that.collection);
		},
		// render template after data refresh
		addWidget: function (addingModel, callback) {
			var that = this, tmpl;

			that.collection.add(addingModel);
			that.render(function () {
				if (callback != null)
					callback();
			}, that.collection);


		}
	});

	return WidgetListView;
});
