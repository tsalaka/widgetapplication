requirejs.config({
	baseUrl: "/Scripts",
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'backbone-relational' : {
			deps: ['backbone']
		}
	},
	/**
		* HACK:
		* Modified Underscore and Backbone to be AMD compatible (define themselves)
		* since it didn't work properly with the RequireJS shim when optimizing
		*/
	paths: {
		'text'               : 'text',
		'jquery': 'jquery-1.8.2.min',
		'jquery-ui': 'jquery-ui-1.10.3',
		'underscore'         : 'underscore-min',
		'backbone': 'backbone-min',
		'backbone-relational': 'backbone-relational',
		'moment'             : 'moment-min',
		'App'                : 'widgets/app',
		'Router'             : 'widgets/router',
		'WidgetModel'      : 'widgets/models/widget',
		'WidgetCollection' : 'widgets/collections/widgets',
		'WidgetListView'   : 'widgets/views/widgets',
		//'WidgetListView'   : 'widgets/views/index',
		'WidgetEditView'   : 'widgets/views/edit',
		'WidgetView': 'widgets/views/widget',
		'MarketDataModel': 'widgets/models/marketdata',
		'MarketDataCollection': 'widgets/collections/marketdata',
		'MarketDataListView': 'widgets/views/marketdata',
		'IgnoredWidgetCollection': 'widgets/collections/ignoredWidgets',
		'IgnoredWidgetListView': 'widgets/views/ignored.index',
	}
});

require(['App'], function (App, Widget) {
	App.initialize();
});
