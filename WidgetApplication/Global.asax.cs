using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Munq;
using Munq.MVC3;
using WidgetApplication.App_Start;
using WidgetApplication.Domain;
using WidgetApplication.Models.DBContext;

namespace WidgetApplication
{
	// Note: For instructions on enabling IIS6 or IIS7 classic mode, 
	// visit http://go.microsoft.com/?LinkId=9394801

	public class MvcApplication : System.Web.HttpApplication
	{
		private void InitializeIoc()
		{
			IocContainer ioc = MunqDependencyResolver.Container;

			ioc.Register<IWidgetRepository, WidgetRepository>();
			ioc.Register<IMarketDataRepository, MarketDataRepository>();
		}

		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();

			WebApiConfig.Register(GlobalConfiguration.Configuration);
			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
			AuthConfig.RegisterAuth();

			//MunqMvc3Startup.PreStart();
			//IocConfiguration.Configure();
			
			Bootstrapper.Initialise();
			//Database.SetInitializer<WidgetContext>(null);
		}

	}
}