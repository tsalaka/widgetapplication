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
	

	public class WidgetRepository : IWidgetRepository
	{
		private readonly WidgetContext _context = new WidgetContext();

		public IQueryable<Widget> All
		{
			get { return this._context.Widgets; }
		}

		public Widget Find(int id)
		{
			return this._context.Widgets.FirstOrDefault(w=>w.Id == id);
		}

	}
}