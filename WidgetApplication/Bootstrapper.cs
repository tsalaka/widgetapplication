using System.Web.Http;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Unity.Mvc3;
using WidgetApplication.Domain;

namespace WidgetApplication
{
    public static class Bootstrapper
    {
        public static void Initialise()
        {
			var container = BuildUnityContainer();

			DependencyResolver.SetResolver(new UnityDependencyResolver(container));
			GlobalConfiguration.Configuration.DependencyResolver = new Unity.WebApi.UnityDependencyResolver(container);
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers
            
            container.RegisterType<IWidgetRepository, WidgetRepository>();
            container.RegisterType<IMarketDataRepository, MarketDataRepository>();

            return container;
        }
    }
}