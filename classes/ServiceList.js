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
        return this.serviceInstances[Math.floor(Math.random()*this.serviceInstances.length)]
    }

    getServiceInstance(serviceId){
        for (let index = 0; index < this.serviceInstances.length; index++) {
            if (this.serviceInstances[index].serviceId == serviceId) {
                return this.serviceInstances[index];
            }
        }
        return false;
    }

    getServiceInstanceWithURLAndPort(serviceUrl,servicePort){
        for (let index = 0; index < this.serviceInstances.length; index++) {
            if (serviceInstance.serviceUrl == serviceUrl && serviceInstance.servicePort == servicePort) {
                return this.serviceInstances[index];
            }
        }
        return false;
    }

    deleteServiceInstance(serviceInstanceId){
        for (let index = 0; index < this.serviceInstances.length; index++) {
            if (this.serviceInstances[index].serviceId == serviceInstanceId) {
                this.serviceInstances.splice(index, 1);
                return true;
            }
        }
        return false;
    }
}
module.exports = ServiceList;