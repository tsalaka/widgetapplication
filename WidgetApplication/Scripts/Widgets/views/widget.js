define('WidgetView', [
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'text!widgets/templates/widget.html',
	'WidgetModel',
	'MarketDataCollection',
	'MarketDataListView',
	'jquery-ui'
], function ($, _, Backbone, moment, tpl, Widget, MarketDataCollection, MarketDataListView) {
	var WidgetView;
	var marketDataListView;
	var editMode;
	
	WidgetView = Backbone.View.extend({
		initialize: function (options) {
			this.template = _.template(tpl);
			if (options) {
				if (options.editMode)
					this.editMode = options.editMode;
			}
		},
		render: function (callback) {
			var tmpl, that;
			that = this;
			$(that.el).html('');
			
			tmpl = that.template({ widget: that.model });
			$(that.el).append(tmpl);

			that.bindMarketData();
			if(!that.editMode)
				that.marketDataRefresh();

			if (callback != null)
				callback($(that.el));
		},
		marketDataRefresh: function () {
			var that = this;
			setInterval(function () {
				$.ajax({
					url: "api/marketdata/" + that.model.Id + "/selected",
					datatype: 'application/json; charset=utf-8',
					success: function (data) {
						var selectedMarketId = that.marketDataListView.selectedMarketId;
						that.marketDataListView = new MarketDataListView({ collection: new MarketDataCollection(data), editMode: that.editMode, selectedMarketId: selectedMarketId });
						that.marketDataListView.render(function (renderElement) {
							$(that.el).find('div[id=widget' + that.model.Id + '_market_data]').html(renderElement);
						});
					}
				});
			}, 20000);
		},
		bindMarketData: function () {
			var that = this;
			if (!that.marketDataListView) {
				that.marketDataListView = new MarketDataListView();
			} 
			that.marketDataListView.collection = that.model.MarketDataCollection;
			that.marketDataListView.editMode = that.editMode;
			
			that.marketDataListView.render(function (renderElement) {
				$(that.el).find('div[id=widget' + that.model.Id + '_market_data]').append(renderElement);
			});
		}
	});

	return WidgetView;
});
