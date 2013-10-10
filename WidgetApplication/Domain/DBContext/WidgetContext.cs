using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WidgetApplication.Model;

namespace WidgetApplication.Models.DBContext
{
	public class WidgetContext : System.Data.Entity.DbContext
	{
		public IQueryable<Widget> Widgets
		{
			get
			{
				var widgets = new List<Widget>();
				widgets.Add(new Widget { Id = 1, Title = "Индексы", UploadDate = DateTime.Now ,MarketDataCollection = MarketData.Where(m=>m.WidgetId == 1).Skip(1).Take(5).ToList()});
				widgets.Add(new Widget { Id = 2, Title = "Валютный Рынок", UploadDate = DateTime.Now, MarketDataCollection = MarketData.Where(m=>m.WidgetId == 2).Take(1).ToList() });
				widgets.Add(new Widget { Id = 3, Title = "Фондовый рынок", UploadDate = DateTime.Now, MarketDataCollection = MarketData.Where(m=>m.WidgetId == 3).OrderByDescending(m=>m.Id).Take(2).ToList() });
				widgets.Add(new Widget { Id = 4, Title = "Срочный рынок", UploadDate = DateTime.Now, MarketDataCollection = MarketData.Where(m=>m.WidgetId == 4).OrderByDescending(m => m.Id).Skip(2).Take(4).ToList() });
				
				return widgets.AsQueryable();
			}
		}

		public IQueryable<MarketItem> MarketData
		{
			get
			{
				Random r = new Random();
				var marketData = (new List<MarketItem>());
				marketData.Add(new MarketItem { Id = 1, WidgetId = 1, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "MICEX", Time = DateTime.Now, ValueReferenceDifference = 0.15 });
				marketData.Add(new MarketItem { Id = 2, WidgetId = 1, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "RTSI", Time = DateTime.Now, ValueReferenceDifference = 0.18 });
				marketData.Add(new MarketItem { Id = 10, WidgetId = 1, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "CCC1", Time = DateTime.Now, ValueReferenceDifference = 0.74 });
				marketData.Add(new MarketItem { Id = 3, WidgetId = 2, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "RTSVX", Time = DateTime.Now, ValueReferenceDifference = -0.09 });
				marketData.Add(new MarketItem { Id = 4, WidgetId = 2, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "AAA2", Time = DateTime.Now, ValueReferenceDifference = 0.47 });
				marketData.Add(new MarketItem { Id = 9, WidgetId = 2, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "BBB2", Time = DateTime.Now, ValueReferenceDifference = 0.84 });
				marketData.Add(new MarketItem { Id = 5, WidgetId = 3, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "BBB3", Time = DateTime.Now, ValueReferenceDifference = -0.19 });
				marketData.Add(new MarketItem { Id = 6, WidgetId = 3, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "CCC3", Time = DateTime.Now, ValueReferenceDifference = -0.70 });
				marketData.Add(new MarketItem { Id = 8, WidgetId = 3, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "DDD3", Time = DateTime.Now, ValueReferenceDifference = -0.41 });
				marketData.Add(new MarketItem { Id = 5, WidgetId = 4, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "BBB4", Time = DateTime.Now, ValueReferenceDifference = -0.19 });
				marketData.Add(new MarketItem { Id = 6, WidgetId = 4, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "CCC4", Time = DateTime.Now, ValueReferenceDifference = -0.70 });
				marketData.Add(new MarketItem { Id = 7, WidgetId = 4, LastValue =  (long)((r.NextDouble() * 2.0 - 1.0) * long.MaxValue), Title = "DDD4", Time = DateTime.Now, ValueReferenceDifference = -0.70 });

				return marketData.AsQueryable();
			}
		}

	}
}