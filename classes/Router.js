'use strict';

const ServiceList = require('./ServiceList');
const Service = require('./Service');

class Router{
    constructor() {
        this.domain = new Array();
    }
    addServiceList(nServicelistName){
        this.domain.forEach(servicelist => {
            let servicelistCached = new ServiceList();
            servicelistCached = servicelist;
            if(servicelistCached.serviceName == servicelistName){
                return false;
            }
        });
        this.domain.push(new ServiceList(nServicelistName));
        return true;
    }

    deleteServiceList(nServicelistName){
        let servicelistCached = new ServiceList();
        for (let index = 0; index < this.domain.length; index++) {
            if(servicelistCached.serviceName == servicelistName){
                this.domain.slice(index,1);
                return true;
            }
        }
        return false;
    }
}
module.exports = Router;