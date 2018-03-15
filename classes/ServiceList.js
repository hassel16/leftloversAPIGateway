'use strict';

const Service = require('./Service');

class ServiceList{
    constructor(serviceName) {
        this.serviceName = serviceName;
        this.serviceInstances = new Array();
    }

    addServiceInstance(serviceUrl,servicePort){
        if(this.isServiceUrlAndPortInServiceInstances(serviceUrl,servicePort)!==false){
            return false;
        }
        let nService = new Service(this.serviceInstances.length,serviceUrl,servicePort);
        this.serviceInstances.push(nService);
        return nService;
    }

    isServiceUrlAndPortInServiceInstances(serviceUrl,servicePort){
        for (let index = 0; index < this.serviceInstances.length; index++) {
            if (new String(this.serviceInstances[index].serviceUrl).valueOf() == new String(serviceUrl).valueOf() && new String(this.serviceInstances[index].servicePort).valueOf() == new String(servicePort).valueOf()) {
                return index;
            }
        }
        return false;
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
        let indexIfExist=this.isServiceUrlAndPortInServiceInstances(serviceUrl,servicePort);
        if(indexIfExist != false){
            return this.serviceInstances[indexIfExist];
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