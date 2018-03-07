'use strict';

const Service = require('./Service');

class ServiceList{
    constructor(serviceName) {
        this.serviceName = serviceName;
        this.serviceInstances = new Array();
    }

    addServiceInstance(serviceUrl,servicePort){
        this.serviceInstances.forEach(serviceInstance => {
            if (serviceInstance.serviceUrl == serviceUrl && serviceInstance.servicePort == servicePort) {
                return false;
            }
        });
        let nService = new Service(this.serviceInstances.length,serviceUrl,servicePort);
        this.serviceInstances.push(nService);
        return nService;
    }

    getRandomService(){
        return this.serviceInstances[Math.floor(Math.random()*items.length)]
    }

    getServiceInstance(serviceId){
        this.serviceInstances.forEach(serviceInstance => {
            if (serviceInstance.serviceId == serviceId) {
                return serviceInstance;
            }
        });
        return false;
    }

    deleteServiceInstance(serviceInstanceId){
        for (let index = 0; index < this.serviceInstances.length; index++) {
            if (this.serviceInstances[index].serviceId == serviceInstanceId) {
                this.serviceInstances.slice(index, 1);
                return true;
            }
        }
        return false;
    }
}
module.exports = ServiceList;