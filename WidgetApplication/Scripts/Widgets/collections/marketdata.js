define('MarketDataCollection', [
  'jquery',
  'underscore',
  'backbone',
  'MarketDataModel'
], function($, _, Backbone, MarketData) {
	var MarketDataCollection;

	MarketDataCollection = Backbone.Collection.extend({
    model : MarketData,
    url: "api/marketdata"
  });

	return MarketDataCollection;
});
