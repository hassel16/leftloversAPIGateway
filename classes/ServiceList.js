'use strict';

class ServiceList{
    constructor(serviceName) {
        this.serviceName = serviceName;
        this.serviceInstances = new Array();
    }

    add(serviceInstance){
        this.serviceInstances.push(serviceInstance)
    }

    getRandomService(){
        let randomInstanceNumber = Math.floor(Math.random() * serviceInstances.length())
    }
}
module.exports = ServiceList;