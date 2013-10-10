using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WidgetApplication.Model;

namespace WidgetApplication.Domain
{
	public interface IMarketDataRepository
	{
		IQueryable<MarketItem> All { get; }
		MarketItem Find(int id);
		
	}
}