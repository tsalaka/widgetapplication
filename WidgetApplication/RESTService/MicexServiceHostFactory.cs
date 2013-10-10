using System;
using System.Collections.ObjectModel;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Channels;
using System.ServiceModel.Configuration;
using System.ServiceModel.Description;
using System.ServiceModel.Dispatcher;
using Microsoft.Practices.Unity;
using WidgetApplication.Domain;
using WidgetApplication.Repositories;

namespace WidgetApplication.RESTService
{
	public class MixecServiceHostFactory : ServiceHostFactory
	{
		protected override ServiceHost CreateServiceHost(Type serviceType, Uri[] baseAddresses)
		{
			return new MicexServiceHost(serviceType, baseAddresses);
		}
	}

	public class MicexServiceHost : ServiceHost
	{
		private static readonly IUnityContainer _container;

		static MicexServiceHost()
		{
			_container = new UnityContainer();
			_container.RegisterType<IWidgetRepository, WidgetRepository>();
			_container.RegisterType<IUnitOfWork, DbUnitOfWork>();
		}

		public MicexServiceHost(Type serviceType, params Uri[] baseAddresses)
			: base(serviceType, baseAddresses)
		{
		}

		protected override void ApplyConfiguration()
		{
			base.ApplyConfiguration();
			Description.Behaviors.Add(_container.Resolve<UnityServiceBehavior>());
		}
	}

	public class UnityServiceBehavior : BehaviorExtensionElement, IServiceBehavior
	{
		private readonly IUnityContainer _container;

		public UnityServiceBehavior(IUnityContainer container)
		{
			_container = container;
		}

		public void AddBindingParameters(ServiceDescription serviceDescription,
		                                 ServiceHostBase serviceHostBase,
		                                 Collection<ServiceEndpoint> endpoints,
		                                 BindingParameterCollection bindingParameters)
		{
		}

		public void ApplyDispatchBehavior(ServiceDescription serviceDescription,
		                                  ServiceHostBase serviceHostBase)
		{
			Type serviceType = serviceDescription.ServiceType;
			IInstanceProvider instanceProvider = new UnityInstanceProvider(_container, serviceType);

			foreach (ChannelDispatcher dispatcher in serviceHostBase.ChannelDispatchers)
			{
				foreach (EndpointDispatcher endpointDispatcher in dispatcher.Endpoints)
				{
					endpointDispatcher.DispatchRuntime.InstanceProvider = instanceProvider;
					endpointDispatcher.DispatchRuntime.MessageInspectors.Add(
						new UnitOfWorkMessageInspector(_container)
						);
				}
			}
		}

		public void Validate(ServiceDescription serviceDescription,
		                     ServiceHostBase serviceHostBase)
		{
		}

		public override Type BehaviorType
		{
			get { return GetType(); }
		}

		protected override object CreateBehavior()
		{
			return this;
		}
	}

	public class UnityInstanceProvider : IInstanceProvider
	{
		private readonly IUnityContainer _container;
		private readonly Type _serviceType;

		public UnityInstanceProvider(IUnityContainer container, Type serviceType)
		{
			_container = container;
			_serviceType = serviceType;
		}

		public object GetInstance(InstanceContext instanceContext, Message message)
		{
			return _container.Resolve(_serviceType);
		}

		public object GetInstance(InstanceContext instanceContext)
		{
			return GetInstance(instanceContext, null);
		}

		public void ReleaseInstance(InstanceContext instanceContext, object instance)
		{
		}
	}
}