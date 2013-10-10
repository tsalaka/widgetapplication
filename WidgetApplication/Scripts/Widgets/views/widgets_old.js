define('WidgetListView', [
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'text!widgets/templates/widgets.html',
	'IgnoredWidgetListView',
	'WidgetView',
	'WidgetCollection',
	'jquery-ui'
], function ($, _, Backbone, moment, tpl, IgnoredWidgetListView, WidgetView, WidgetCollection) {
	var WidgetListView;
	
	WidgetListView = Backbone.View.extend({
		initialize: function () {
			this.template = _.template(tpl);
			this.collection = new WidgetCollection();
			this.viewCollection = new Backbone.Collection();
		},
		events: {
		//	'click .remove-btn': 'removeFromSelectedWidgets'
		//	'click .market-data-add': 'addMarketDataItem'
		},
		// render template after data refresh
		render: function (callback, collection) {
			var that = this, tmpl;
			if (!collection) {
				that.getData(function(coll) {
					$(that.el).html('');
					that.collection = coll;
					$.each(that.collection.toJSON(), function () {
						var widgetView = new WidgetView({ model: this });
						that.viewCollection = that.viewCollection.add(widgetView);
						widgetView.render(function () {
							$(that.el).append($(widgetView.el).html());
						});
					});
				});
			} else {
				$(that.el).html('');
				that.collection = collection;
				$.each(that.collection.toJSON(), function () {
					var widgetView = new WidgetView({ model: this });
					widgetView.render(function () {
						$(that.el).append($(widgetView.el).html());
					});
					widgetView.on('add-to-ignored-success', function (model, view) {
						that.removeWidgetFromSelected(model, view);
					});
				});
			}
			

			/*if (!this.ignoredWidgetListView) {
				this.ignoredWidgetListView = new IgnoredWidgetListView();
			}
			this.ignoredWidgetListView.render(function () {
				this.ignoredWidgetsHtml = $(that.ignoredWidgetListView.el).html();
			});
			
			tmpl = that.template({ selectedWidgets: this.selectedWidgetsHtml, ignoredWidgets: this.ignoredWidgetsHtml });
			$(that.el).append(tmpl);

			// subscribe to events
			this.ignoredWidgetListView.on('add-to-selected-success', function (model) {
				that.widgetView.addWidget(model);
			});
			
			*/
				
			if(callback != null)
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
		},
		removeWidgetFromSelected: function (removedModel, removedView) {
			var that = this;
		that.collection.remove(removedModel);
		that.viewCollection.remove(removedView);
		that.render(null, that.collection);
			/*tmpl = that.template({ widgets: that.collection.toJSON() });
			$(that.el).html(tmpl);*/
			this.trigger('add-to-ignored-success', removedModel);
		},
		
	/*	addMarketDataItem: function (e) {
			var that, tmpl;
			that = this;
			var widgetId = $(e.target).attr("id_attr");
			var selectedMarketDataId = $('input[name="h_widget' + widgetId + '_selected_market_data"]').val();

			var marketDataItem = that.collection.get(widgetId).get('IgnoredMarketDataCollection').get(selectedMarketDataId);
			that.collection.get(widgetId).get('IgnoredMarketDataCollection').remove(marketDataItem);
			that.collection.get(widgetId).get('MarketDataCollection').add(marketDataItem);
			tmpl = that.template({ widgets: that.collection.toJSON() });
			$(that.el).html(tmpl);
		},*/
		// render template after data refresh
		addWidget: function (addingModel, callback) {
			var that = this, tmpl;

			that.collection.add(addingModel);
			that.render(function () {
				if (callback != null)
					callback();
			}, that.collection);
			/*tmpl = that.template({ widgets: that.collection.toJSON() });
			$(that.el).html(tmpl);
			*/
			
		}
	});

	return WidgetListView;
});
