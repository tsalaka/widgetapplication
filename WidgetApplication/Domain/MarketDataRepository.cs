using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using WidgetApplication.Model;
using WidgetApplication.Models.DBContext;
using WidgetApplication.Domain;

namespace WidgetApplication.Domain
{
	public class MarketDataRepository : IMarketDataRepository
	{
		private readonly WidgetContext _context = new WidgetContext();

		public IQueryable<MarketItem> All
		{
			get { return this._context.MarketData; }
		}

		public MarketItem Find(int id)
		{
			return this._context.MarketData.FirstOrDefault(w=>w.Id == id);
		}

	}
}