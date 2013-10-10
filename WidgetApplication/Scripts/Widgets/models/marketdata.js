define('MarketDataModel', [
  'jquery',
  'underscore',
  'backbone',
		'backbone-relational'
], function($, _, Backbone) {
  var MarketData;

  MarketData = Backbone.RelationalModel.extend({
    idAttribute: "Id",
    urlRoot: "api/marketdata",
    defaults: {
    	Id: 0,
    	Title: '',
    	Time: "1/1/2013 12:00:00",
    	LastValue: 0,
    	ValueReferenceDifference: 0
    }/*,
    initialize: function () {
    	this.Id = this.get('Id');
    	this.data = this.get('Data');
    	this.id = this.get('Id');
    	this.name = this.get('Name');
    }
   */

  });

  return MarketData;
});
