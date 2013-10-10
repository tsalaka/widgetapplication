using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WidgetApplication.Model
{
	public class MarketItem
	{
		public virtual int Id { get; set; }
		public virtual string Title { get; set; }
		public virtual DateTime Time { get; set; }
		public virtual long LastValue { get; set; }
		public virtual double ValueReferenceDifference { get; set; }

		public virtual int WidgetId { get; set; }
	}
}