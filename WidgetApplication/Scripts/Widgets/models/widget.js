define('WidgetModel', [
  'jquery',
  'underscore',
  'backbone',
  'backbone-relational',
  'MarketDataModel',
  'MarketDataCollection'
], function ($, _, Backbone, BackboneRelational,MarketDataModel, MarketDataCollection) {
  var Widget;

  Widget = Backbone.RelationalModel.extend({
  	relations: [{
  		type: Backbone.HasMany,
  		key: 'MarketDataCollection',
  		collectionType: 'MarketDataCollection',
  		relatedModel: 'MarketData'
  	},
  	{
  		type: Backbone.HasMany,
  		key: 'IgnoredMarketDataCollection',
  		collectionType: 'MarketDataCollection',
  		relatedModel: 'MarketData'
  	}],
    idAttribute: "Id",
    urlRoot: "api/widget",
    // set defaults for checking existance in the template for the new model
    defaults: {
    	Id: 0,
    	Title: '',
    	UploadDate: "1/1/2013"    	
    },
    initialize: function () {
    	this.set('MarketDataCollection', new MarketDataCollection(this.get('MarketDataCollection')));
    },
    validate: function(attrs) {
      var fields, i, len, titleLen, errors = {};

      /**
       * HACK: don't validate when silent is passed as an attribute
       * Useful when fetching model from server only by id
       */
      if (!attrs._silent) {
        // check required fields
        // check required fields
        fields = ['Title', 'UploadDate'];
        for (i = 0, len = fields.length; i < len; i++) {
          if (!attrs[fields[i]]) {
            errors[fields[i]] = fields[i] + ' required';
          }
        }

        // check valid Title
        titleLen = (attrs.Title) ? attrs.Title.length : null;
        if (titleLen < 2 || titleLen > 100) {
          errors.Title = "invalid Title";
        }

        /*// check valid company
        compLen = (attrs.company) ? attrs.company.length : null;
        if (!compLen || (compLen < 7 || compLen > 100)) {
          errors.company = "invalid company";
        }

        // check valid email
        if (!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(attrs.email))) {
          errors.email = "invalid email";
        }*/

        if (_.keys(errors).length) {
          return {
            errors: errors
          };
        }
      }

    }
  });

  return Widget;
});
