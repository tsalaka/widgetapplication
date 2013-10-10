using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using Munq;
using Munq.LifetimeManagers;
using Munq.MVC3;
using WidgetApplication.Controllers;
using WidgetApplication.Domain;

namespace WidgetApplication
{
	public static class IocConfiguration
	{
		public class Hack { }

		public static void Configure()
		{
			var container = MunqDependencyResolver.Container;
			container.Register<Hack>(ioc => new Hack()).AsRequestSingleton();
			var hack = container.Resolve<Hack>();

			RegisterRepositories(container);
			RegisterControllers(container);
		}

		private static void RegisterRepositories(IocContainer container)
		{
			container.Register<IWidgetRepository>(ioc => new WidgetRepository()).WithLifetimeManager(new AlwaysNewLifetime());
			container.Register<IMarketDataRepository>(ioc => new MarketDataRepository()).WithLifetimeManager(new AlwaysNewLifetime());
		}

		private static void RegisterControllers(IocContainer container)
		{
			container.Register<IHttpController>("WidgetController", ioc => new WidgetController(ioc.Resolve<IWidgetRepository>()));
		//	container.Register<IController>("SomeOtherController", ioc => new SomeOtherController(ioc.Resolve<ISomeRepository>(), ioc.Resolve<ISomeOtherRepository>()));
		}

	}
}