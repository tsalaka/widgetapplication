define('MarketDataListView', [
	'jquery',
	'underscore',
	'backbone',
	'moment',
	'text!widgets/templates/marketdata.html',
	'MarketDataCollection',
	'jquery-ui'
], function ($, _, Backbone, moment, tpl, MarketDataCollection) {
	var MarketDataListView;
	var ignoredeMarketDataCollection;
	var widgetId;
	var selectedMarketIds;
	var titleDialog;
	
	MarketDataListView = Backbone.View.extend({
		initialize: function (options) {
			this.template = _.template(tpl);
			
			this.selectedMarketIds = [];
			if (options) {
				if (options.editMode)
					this.editMode = options.editMode;
				if (options.selectedMarketId)
					this.selectedMarketIds = options.selectedMarketIds;
			}
		},
		events: {
			//'click .remove-btn2': 'remove',
			'click .market-data-lnk': 'marketItemClick',
			'click .market-data-add': 'addMarketDataItem'
		},
		// render template after data refresh
		render: function (callback) {
			var that = this, tmpl;
			var defaultWidget = that.collection.at(0);
			if (!defaultWidget)
				that.widgetId = 0;
			else
				that.widgetId = defaultWidget.get('WidgetId');
			$(that.el).html('');
			
			tmpl = that.template({ marketDataCollection: that.collection.toJSON(), widgetId: that.widgetId });

			$(that.el).append(tmpl);

			/*refactoring: move to a method */
			if (that.editMode)
				that.setSortable();

			that.paintChart(that.selectedMarketIds);

			/*refactoring: move to a method */
			that.titleDialog = $(that.el).find('div[name=marketdata_chart_title]');
			if (that.titleDialog.length)
				that.titleDialog.draggable({
					containment: 'parent'
				});
			that.titleDialog.find("a").click(function () {
				that.removeItemFromChart(null, 0, true);
				that.titleDialog.css('display', 'none');
			});
			
			/*refactoring: move to a method */
			$(that.el).find('input[name="ignored_market_data"]').each(function (index) {
				var inputElement = $(this);
				inputElement.autocomplete({
					source: function (request, response) {
						$.ajax({
							url: "api/marketdata/" + that.widgetId + "/all",
							datatype: 'application/json; charset=utf-8',
							success: function (data) {
								that.ignoredeMarketDataCollection = new MarketDataCollection(_.filter(data, function (item) { return that.collection.get(item.Id) == undefined;}));
								response($.map(that.ignoredeMarketDataCollection.toJSON(), function (item) {
									return {
										label: item.Title,
										value: item.Id
									};
								}));
							}
						});
					},
					select: function (event, ui) {
						$(this).val(ui.item.label);
						$(that.el).find('input[name="h_widget' + that.widgetId + '_selected_market_data"]').val(ui.item.value);
						return false;
					},
					minLength: 2
				});
			});
			
			that.on("click .remove-btn2", that.remove);
			
			
			if (callback != null)
				callback($(that.el));
		},
		setSortable: function () {
			var that = this;
			$(that.el).find("div[name=marketdata_table]").sortable({
				items: "> div[name=marketdata_item]",
				cursor: 'move',
				opacity: 0.6,
				update: function (event, ui) {
					var marketDataOrder = $(this).sortable('toArray', { attribute: 'id_attr' }).toString();
					//	$.get('update-sort.cfm', { marketDataOrder: marketDataOrder });
				},
				stop: function (e, ui) {
					var x = e.pageX - this.offsetLeft;
					var y = e.pageY - this.offsetTop;
					var chart = $(that.el).find('div[name=marketdata_chart]:not(:hidden) div[name=chart_img]');
					if (chart.length) {
						var chartOff = chart.offset();
						if (x > chartOff.left && x < chart.width() + chartOff.left && y > chartOff.top && y < chartOff.top + chart.height()) {
							var addedId = ui.item.find('a.market-data-lnk').attr('id_attr');
							that.addItemToChart(addedId);
							$(this).sortable('cancel');
						}
					}
				}
			});
		},
		remove: function (e) {
			var that;
			that = this;
			var id = $(e.target).attr("id_attr");
			var removedModel = that.collection.get(id);
			that.collection.remove(removedModel);
			that.render();
			this.trigger('add-to-ignored-success', removedModel);
		},
		addMarketDataItem: function (e) {
			var that;
			that = this;
			var selectedMarketDataId = $(that.el).find('input[name="h_widget' + that.widgetId + '_selected_market_data"]').val();
			var marketDataItem = that.ignoredeMarketDataCollection.get(selectedMarketDataId);
			that.collection.add(marketDataItem);
			that.ignoredeMarketDataCollection.remove(marketDataItem);
			that.render();
		},
		paintChart: function () {
		
			var linkToImage;
			var that = this;
			var chartDiv = $(that.el).find('div[name=marketdata_chart]');

			//paint chart for selected marketdata
			var mainId = _.first(that.selectedMarketIds);
			if (mainId != undefined) {
				chartDiv.css('display', '');
				linkToImage = 'http://www.moex.com/cs/engines/stock/markets/index/boardgroups/9/securities/MICEXINNOV.png?c.width=339&z1.width=339&z1_c.width=339&c.height=169.5&z1.height=169.5&z1_c.height=169.5&template=adv_no_volume&_=1378213644040&compare=stock%3Aindex%3AMICEXMBITR&compare_template=adv_no_volume_comp&candles=72&interval=10';
				var marketItemDiv = $(that.el).find('div[name=marketdata_item][id_attr=' + mainId + '] > div');
				marketItemDiv.append(chartDiv);
				chartDiv.find("div[name=chart_img]").css('background-image', 'url("' + linkToImage + '")');
			}
			$.each(that.selectedMarketIds, function () {
				if(this != mainId) {
					that.addItemToChart(this);
				}
			});
		},
		marketItemClick: function (e) {
			this.selectedMarketIds.push($(e.target).attr("id_attr"));
			this.paintChart();
		},
		addItemToChart: function (addItemId) {
			var linkToImage, id;
			var that = this;
			var chartDiv = $(that.el).find('div[name=marketdata_chart]');
			
			if (addItemId != undefined) {
				//add marketdata to chart
				if (_.find(that.selectedMarketIds, function (obj) { return obj == addItemId; }) == undefined)
					this.selectedMarketIds.push(addItemId);
				linkToImage = 'http://www.moex.com/cs/engines/stock/markets/index/boardgroups/9/securities/RTSI.png?c.width=339&z1.width=339&z1_c.width=339&c.height=169.5&z1.height=169.5&z1_c.height=169.5&template=adv_no_volume&_=1378297798010&compare=stock%3Aindex%3AMICEXINDEXCF&compare_template=adv_no_volume_comp&candles=72&interval=10';
				that.titleDialog.css('display', 'block');
				that.titleDialog.find('#title').html(that.collection.get(addItemId).get('Title'));
				chartDiv.find("div[name=chart_img]").css('background-image', 'url("' + linkToImage + '")');
			}
			
		},
		removeItemFromChart: function () {
			var linkToImage, id;
			var that = this;
			var chartDiv = $(that.el).find('div[name=marketdata_chart]');
			chartDiv.css('display', '');

			//paint chart for selected marketdata
			id = that.selectedMarketId;
			linkToImage = 'http://www.moex.com/cs/engines/stock/markets/index/boardgroups/9/securities/MICEXINNOV.png?c.width=339&z1.width=339&z1_c.width=339&c.height=169.5&z1.height=169.5&z1_c.height=169.5&template=adv_no_volume&_=1378213644040&compare=stock%3Aindex%3AMICEXMBITR&compare_template=adv_no_volume_comp&candles=72&interval=10';
			chartDiv.find("div[name=chart_img]").css('background-image', 'url("' + linkToImage + '")');
		}
	});

	return MarketDataListView;
});
