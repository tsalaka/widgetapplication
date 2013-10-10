using System.Web.Mvc;
using Munq.MVC3;
using WidgetApplication.Domain;

[assembly: WebActivator.PreApplicationStartMethod(
	typeof(WidgetApplication.App_Start.MunqMvc3Startup), "PreStart")]

namespace WidgetApplication.App_Start {
	public static class MunqMvc3Startup {
		public static void PreStart() {
			DependencyResolver.SetResolver(new MunqDependencyResolver());

		
			
		}
	}
}
 

