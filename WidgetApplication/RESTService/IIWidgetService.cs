using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using WidgetApplication.Model;

namespace WidgetApplication.RESTService
{
	[ServiceContract]
	public interface IWidgetService
	{
		[OperationContract]
		[WebInvoke(Method = "GET",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			UriTemplate = "/json/widget/{id}")
		]
		Widget WidgetByIdGet(string id);

		[OperationContract]
		[WebInvoke(Method = "GET",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			UriTemplate = "/json/marketdata/{id}")
		]
		MarketItem MarketDataByIdGet(string id);

		[OperationContract]
		[WebInvoke(Method = "GET",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			UriTemplate = "/json/widgets/ignored")]
		List<Widget> IgnoredWigdetCollection();

		[OperationContract]
		[WebInvoke(Method = "GET",
			RequestFormat = WebMessageFormat.Json,
			ResponseFormat = WebMessageFormat.Json,
			UriTemplate = "/json/widgets/selected")]
		List<Widget> SelectedWigdetCollection();

		

		
	}
}
