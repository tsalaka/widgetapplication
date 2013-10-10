define('WidgetCollection', [
  'jquery',
  'underscore',
  'backbone',
  'WidgetModel'
], function($, _, Backbone, Widget) {
  var WidgetCollection;

  WidgetCollection = Backbone.Collection.extend({
    model : Widget,
    url: "api/widget/selected"
  });

  return WidgetCollection;
});
