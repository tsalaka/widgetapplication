using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using Newtonsoft.Json;
using WidgetApplication.Domain;
using WidgetApplication.Model;
using WidgetApplication.RESTService;

namespace WidgetApplication.RESTService
{
	public class WidgetService : IWidgetService
	{
		private readonly IWidgetRepository widgetContext;
		private readonly IMarketDataRepository marketDataContext;
		public WidgetService()
		{
			this.widgetContext = new WidgetRepository();// widgetContext;
			this.marketDataContext = new MarketDataRepository();// widgetContext;
		}


		public MarketItem MarketDataByIdGet(string id)
		{
			int marketId;
			if (int.TryParse(id, out marketId))
			{
				return marketDataContext.Find(marketId);
			}
			return null;
		}

		public List<Widget> SelectedWigdetCollection()
		{
			return widgetContext.All.Take(2).ToList();
		}

		public List<Widget> IgnoredWigdetCollection()
		{
			return widgetContext.All.Skip(2).ToList();
		}

		public Widget WidgetByIdGet(string id)
		{
			//WebOperationContext.Current.OutgoingResponse.ContentType = "application/json; charset=utf-8";
			int windgetId;
			if (int.TryParse(id, out windgetId))
			{
				return widgetContext.Find(windgetId);
			}
			return null;
		}
	}
}
