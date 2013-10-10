using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WidgetApplication.Model
{
	public class Widget
	{
		public virtual string Title { get; set; }
		public virtual int Id { get; set; }
		public virtual List<MarketItem> MarketDataCollection { get; set; }
		public virtual DateTime UploadDate { get; set; }
	}
}