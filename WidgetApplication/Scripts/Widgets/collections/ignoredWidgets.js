define('IgnoredWidgetCollection', [
  'jquery',
  'underscore',
  'backbone',
  'WidgetModel'
], function($, _, Backbone, Widget) {
	var IgnoredWidgetCollection;

  IgnoredWidgetCollection = Backbone.Collection.extend({
    model : Widget,
    url: "api/widget/ignored"
  });

  return IgnoredWidgetCollection;
});
