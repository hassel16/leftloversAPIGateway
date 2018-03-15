'use strict';

const ServiceList = require('./ServiceList');
const Service = require('./Service');
const jsonfile = require('jsonfile');
const fs = require('fs');
const jsonSaveFile = './router.json';
//const jsonSaveFileObj = require(jsonSaveFile);

class Router {
    constructor() {
        this.domain = new Array();
    }
    
    addServiceList(nServicelistName) {
        for (let index = 0; index < this.domain.length; index++) {
            if (this.domain[index].serviceName == nServicelistName) {
                return false;
            }
        }
        this.domain.push(new ServiceList(nServicelistName));
        return true;
    }

    deleteServiceList(nServicelistName) {
        for (let index = 0; index < this.domain.length; index++) {
            if (this.domain[index].serviceName == nServicelistName) {
                this.domain.splice(index, 1);
                return true;
            }
        }
        return false;
    }

    getServiceList(nServicelistName) {
        for (let index = 0; index < this.domain.length; index++) {
            if (this.domain[index].serviceName == nServicelistName) {
                return this.domain[index];
            }
        }
        return false;
    }

    route(needServiceName) {
        let serviceList = Object.assign(new ServiceList(),this.getServiceList(needServiceName));
        if(serviceList == false){
            return false;
        }else{
            return serviceList.getRandomService();
        }
    }

    saveInJSON(){
        jsonfile.writeFileSync(jsonSaveFile, this)
    }

    static readFromJSON(){
        return Object.assign(new Router(),jsonfile.readFileSync(jsonSaveFile))
    }
}
module.exports = Router;