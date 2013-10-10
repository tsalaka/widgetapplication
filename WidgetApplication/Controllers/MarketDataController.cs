using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WidgetApplication.Domain;
using WidgetApplication.Model;

namespace WidgetApplication.Controllers
{
	public class MarketDataController : ApiController
	{
		private readonly IMarketDataRepository marketDataContext;
		private readonly IWidgetRepository widgetContext;
		public MarketDataController(IMarketDataRepository marketDataContext,IWidgetRepository widgetContext)
		{
			this.widgetContext = widgetContext;
			this.marketDataContext = marketDataContext;
		}

		public MarketItem GetMarketData(int id)
		{
			return marketDataContext.Find(id);
		}

		public List<MarketItem> GetMarketData()
		{
			return marketDataContext.All.ToList();
		}

		public List<MarketItem> GetMarketData(int widgetId, string type)
		{
			List<MarketItem> selectedMarketData;
			switch (type)
			{
				case "selected":
					selectedMarketData = widgetContext.Find(widgetId).MarketDataCollection;
					return selectedMarketData;
				case "ignored":
					selectedMarketData = widgetContext.Find(widgetId).MarketDataCollection;
					var w = marketDataContext.All.Where(m => m.WidgetId == widgetId && selectedMarketData.All(c => c.Id != m.Id)).ToList();
					return w;
				case "all":
					var all = marketDataContext.All.Where(m => m.WidgetId == widgetId).ToList();
					return all;
			}
			return null;
		}
	}
}
