using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Description;
using System.ServiceModel.Channels;
using System.ServiceModel.Dispatcher;
using System.Web;
using System.Web.Mvc;
using Microsoft.Practices.Unity;
using Unity.Mvc4;
using WidgetApplication.Domain;
using ServiceDescription = System.Web.Services.Description.ServiceDescription;

namespace WidgetApplication.RESTService
{
	internal class DIInstanceProvider : IInstanceProvider
	{
		private readonly IUnityContainer container;
		private readonly Type contractType;

		public DIInstanceProvider(IUnityContainer container, Type contractType)
		{
			this.container = container;
			this.contractType = contractType;
		} 
		public object GetInstance(InstanceContext instanceContext)
		{
			return GetInstance(instanceContext, null);
		}

		public object GetInstance(InstanceContext instanceContext, Message message)
		{
				return container.Resolve(contractType);
		}

	
		public void ReleaseInstance(InstanceContext instanceContext, object instance)
		{
			container.Teardown(instance);
		}
	}

	public class DIServiceBehavior : Attribute, IServiceBehavior
	{
		private readonly IUnityContainer container;
   
		public DIServiceBehavior(IUnityContainer container)
		{
			this.container = container;
		}
  
		public void Validate(System.ServiceModel.Description.ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
		{
		}

		public void AddBindingParameters(System.ServiceModel.Description.ServiceDescription serviceDescription, ServiceHostBase serviceHostBase, Collection<ServiceEndpoint> endpoints, BindingParameterCollection bindingParameters)
		{
			
		}

		public void AddBindingParameters(ServiceDescription serviceDescription, ServiceHostBase serviceHostBase, Collection<ServiceEndpoint> endpoints, BindingParameterCollection bindingParameters)
		{
		}
 
		public void ApplyDispatchBehavior(System.ServiceModel.Description.ServiceDescription serviceDescription, ServiceHostBase serviceHostBase)
		{
			foreach (ChannelDispatcher channelDispatcher in serviceHostBase.ChannelDispatchers)
			{
				foreach (EndpointDispatcher endpointDispatcher in channelDispatcher.Endpoints)
				{
					if (endpointDispatcher.ContractName != "IMetadataExchange")
					{
						string contractName = endpointDispatcher.ContractName;
						ServiceEndpoint serviceEndpoint = serviceDescription.Endpoints.FirstOrDefault(e => e.Contract.Name == contractName);
						endpointDispatcher.DispatchRuntime.InstanceProvider = new DIInstanceProvider(this.container,
																										serviceEndpoint.Contract.
																											ContractType);
					}
				}
			}
		}
	}

	public class UnityServiceHost : ServiceHost
	{
		private IUnityContainer unityContainer;
  
		public UnityServiceHost(IUnityContainer unityContainer, Type serviceType) : base(serviceType)
		{
		this.unityContainer = unityContainer;
		}

		protected override void OnOpening()
		{
			base.OnOpening();

			if (this.Description.Behaviors.Find<DIServiceBehavior>() == null)
			{
				this.Description.Behaviors.Add(new DIServiceBehavior(this.unityContainer));
			}
		}
	}
}