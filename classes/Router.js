'use strict';

const ServiceList = require('./ServiceList');
const Service = require('./Service');

class Router {
    constructor() {
        this.domain = new Array();
    }
    
    addServiceList(nServicelistName) {
        this.domain.forEach(servicelist => {
            if (servicelist.serviceName == servicelistName) {
                return false;
            }
        });
        this.domain.push(new ServiceList(nServicelistName));
        return true;
    }

    deleteServiceList(nServicelistName) {
        for (let index = 0; index < this.domain.length; index++) {
            if (this.domain[index].serviceName == servicelistName) {
                this.domain.slice(index, 1);
                return true;
            }
        }
        return false;
    }

    getServiceList(nServicelistName) {
        for (let index = 0; index < this.domain.length; index++) {
            if (this.domain[index].serviceName == servicelistName) {
                return this.domain[index];
            }
        }
        return false;
    }

    route(needServiceName) {

    }
}
module.exports = Router;