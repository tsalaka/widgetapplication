define('Router', [
  'jquery',
  'underscore',
  'backbone',
  'WidgetListView',
	'IgnoredWidgetListView',
  "WidgetView",
  'WidgetEditView',
  'WidgetModel'
], function ($, _, Backbone, WidgetListView, IgnoredWidgetListView, WidgetView, WidgetEditView, Widget) {
  var AppRouter, initialize;

  AppRouter = Backbone.Router.extend({
    routes: {
    	'': 'showWidgets',
      'widgets'     : 'showWidgets', // /#/widgets
      'widgets/new' : 'addWidget',
      'widgets/:id' : 'showWidget',
      'widgets/:id/edit' : 'editWidget',
      // any other action defaults to the following handler
      '*actions'    : 'defaultAction'
    },
    initialize: function() {
      this.widgetView = {};
      this.widgetEditView = {};
      // cached elements
      this.elms = {
        'selected_widgets': $('#selected_widgets'),
        'ignored_widgets': $('#ignored_widgets')
      };
    },
    showWidgets: function() {
      var that = this;

      //this.headerView.select('list-menu');

			if (!this.widgetListView) {
				this.widgetListView = new WidgetListView({editMode:true});
      }
      this.widgetListView.render(function () {
      	that.elms['selected_widgets'].html(that.widgetListView.el);
      });
    
	    
      if (!this.ignoredWidgetListView) {
      	this.ignoredWidgetListView = new IgnoredWidgetListView();
      }
      this.ignoredWidgetListView.render(function () {
      	that.elms['ignored_widgets'].html(that.ignoredWidgetListView.el);
      });
	    
			// subscribe to events
			this.ignoredWidgetListView.on('add-to-selected-success', function (model) {
      	that.widgetListView.addWidget(model);
      });
      this.widgetListView.on('add-to-ignored-success', function (model) {
      	that.ignoredWidgetListView.addWidget(model);
      });
    },
    showWidget: function(id) {
      var that = this, view;

      // pass _silent to bypass validation to be able to fetch the model
      model = new Widget({ id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          view = new WidgetView({ model: model });
          that.elms['selected_widgets'].html(view.render().el);
          view.model.on('delete-success', function() {
            delete view;
            that.navigate('widgets', { trigger: true });
          });
        },
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });
    },
    addWidget: function() {
      var that = this, model, view;

     // this.headerView.select('new-menu');

      model = new Widget();
      view  = new WidgetEditView({ model: model });

      this.elms['selected_widgets'].html(view.render().el);
      view.on('back', function() {
        delete view;
        that.navigate('#/widgets', { trigger: true });
      });
      view.model.on('save-success', function(id) {
        delete view;
        that.navigate('#/widgets/' + id, { trigger: true });
      });
    },
    editWidget: function(id) {
      var that = this, model, view;

      // pass _silent to bypass validation to be able to fetch the model
      model = new Widget({ id: id, _silent: true });
      model.fetch({
        success : function(model) {
          model.unset('_silent');

          // Create & render view only after model has been fetched
          view = new WidgetEditView({ model: model });
          that.elms['selected_widgets'].html(view.render().el);
          view.on('back', function() {
            delete view;
            that.navigate('#/widgets/' + id, { trigger: true });
          });
          view.model.on('save-success', function() {
            delete view;
            that.navigate('#/widgets/' + id, { trigger: true });
          });
        },
        error   : function(model, res) {
          if (res.status === 404) {
            // TODO: handle 404 Not Found
          } else if (res.status === 500) {
            // TODO: handle 500 Internal Server Error
          }
        }
      });

    },
    defaultAction: function(actions) {
      // No matching route, log the route?
    }
  });

  return AppRouter;
});
