using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WidgetApplication.Model;

namespace WidgetApplication.Domain
{
	public interface IWidgetRepository
	{
		IQueryable<Widget> All { get; }
		Widget Find(int id);
	}
}