using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WidgetApplication.Models.DBContext;

namespace WidgetApplication.Repositories
{
	public interface IUnitOfWork
	{
		void Commit();
	}

	public class DbUnitOfWork : IUnitOfWork
	{
		WidgetContext _context;

		public DbUnitOfWork(WidgetContext context)
		{
			_context = context;
		}

		public void Commit()
		{
			_context.SaveChanges();
		}
	}
}