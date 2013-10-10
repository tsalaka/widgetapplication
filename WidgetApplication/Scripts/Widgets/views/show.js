define('WidgetView', [
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'text!widgets/templates/show.html',
	'WidgetModel'
], function($, _, Backbone, moment, tpl, Widget) {
	var WidgetView;

	WidgetView = Backbone.View.extend({
		initialize: function() {
			this.template = _.template(tpl);
			this.model.bind('all',   this.render, this);
		},
		events: {
			"click .delete-btn": "removeWidget"
		},
		render: function() {
			var that = this, tmpl;
			var uploadDateAttr = that.model.get('UploadDate');
			var formattedDate = moment(uploadDateAttr).format("DD.MM.YYYY");
			tmpl = that.template({ widget: this.model.toJSON(), formattedDate: formattedDate });
			$(that.el).html(tmpl);

			return this;
		},
		removeWidget: function(e) {
			e.preventDefault();

			this.model.destroy({
				sync: true,
				success: function(model) {
					model.trigger('delete-success');
				},
				error: function(model, res) {
					if (res.status === 404) {
						// TODO: handle 404 Not Found
					} else if (res.status === 500) {
						// TODO: handle 500 Internal Server Error
					}
				}
			})
		}
	});

	return WidgetView;
});
