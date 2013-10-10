using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Dispatcher;
using System.Web;
using Microsoft.Practices.Unity;
using WidgetApplication.Repositories;

namespace WidgetApplication.RESTService
{
	public class UnitOfWorkMessageInspector : IDispatchMessageInspector
	{
		IUnityContainer _container;
		public UnitOfWorkMessageInspector(IUnityContainer container)
		{
			_container = container;
		}

		public object AfterReceiveRequest(ref Message request, IClientChannel channel,
		  InstanceContext instanceContext)
		{
			return _container.Resolve<IUnitOfWork>();
		}

		public void BeforeSendReply(ref Message reply, object correlationState)
		{
			((IUnitOfWork)correlationState).Commit();
		}
	}
}