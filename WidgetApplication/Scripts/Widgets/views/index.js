define('WidgetListView', [
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'text!widgets/templates/index.html',
	'WidgetCollection',
	'MarketDataCollection',
	'MarketDataListView',
	'jquery-ui'
], function ($, _, Backbone, moment, tpl, WidgetCollection, MarketDataCollection, MarketDataListView) {
	var WidgetListView;
	var marketDataCollectionView;

	WidgetListView = Backbone.View.extend({
		initialize: function() {
			this.template = _.template(tpl);
			this.collection = new WidgetCollection();
		},
		events: {
			'click .remove-btn': 'removeFromSelectedWidgets'
			/*'click .market-data-add': 'addMarketDataItem'*/
		},
		bind: function () {
			var tmpl, that;
			that = this;
			$(that.el).html('');
			$.each(that.collection.toJSON(), function () {
				var widget = this;
				tmpl = that.template({ widget: widget });
				$(that.el).append(tmpl);

				that.bindMarketData(widget, that);
				// todo: marketdataview should be unique for each widget (add as widget model property)
			/*	setInterval(function () {
					$.ajax({
						url: "api/marketdata/" + widget.Id + "/selected",
						datatype: 'application/json; charset=utf-8',
						success: function (data) {
							var selectedMarketId = that.marketDataCollectionView.selectedMarketId;
							that.marketDataCollectionView = new MarketDataListView({ collection: new MarketDataCollection(data) });
							that.marketDataCollectionView.render(function (renderElement) {
								$(that.el).find('div[id=widget' + widget.Id + '_market_data]').html(renderElement);
							},selectedMarketId);
						}
					});
				}, 20000);*/
			});
		},
		// render template after data refresh
		render: function(callback, collection) {
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
		bindMarketData: function (widget, that) {
			that.marketDataCollectionView = new MarketDataListView({ collection: widget.MarketDataCollection });
			that.marketDataCollectionView.render(function (renderElement) {
				$(that.el).find('div[id=widget' + widget.Id + '_market_data]').append(renderElement);
			});
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
		setSortable: function (e) {
			$('#selected_widgets').sortable({
				cursor: 'move',
		//		distance: 5,
				opacity: 0.6,
				items: " div[name=widget_table]",
				update: function (event, ui) {
					var marketDataOrder = $(this).sortable('toArray', { attribute: 'id_attr' }).toString();
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
									},that.collection);
			//tmpl = that.template({ widgets: that.collection.toJSON() });
			//$(that.el).html(tmpl);
			
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
			
	
		}
	});

	return WidgetListView;
});
