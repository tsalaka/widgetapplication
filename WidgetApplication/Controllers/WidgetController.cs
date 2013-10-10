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
	public class WidgetController : ApiController
	{
		private readonly IWidgetRepository widgetContext;

		public WidgetController(IWidgetRepository widgetContext)
		{
			this.widgetContext = widgetContext;
		}


		public List<Widget> GetWidget(string type)
		{
			switch (type)
			{
				case "selected":
					var widgets = widgetContext.All.Take(2).ToList();
					return widgets;
				case "ignored":
					return widgetContext.All.Skip(2).ToList();
			}
			return widgetContext.All.ToList();
		}




		public Widget GetWidget(int id)
		{
			//WebOperationContext.Current.OutgoingResponse.ContentType = "application/json; charset=utf-8";
			return widgetContext.Find(id);
		}
	}
}
