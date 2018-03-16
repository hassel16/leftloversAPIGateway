'use strict';

const ServiceList = require('./ServiceList');
const Service = require('./Service');
const jsonfile = require('jsonfile');
const fs = require('fs');
const jsonSaveFile = './router.json';
const apiProxy = require('http-proxy').createProxyServer();
const https = require('https');
const Error = require('./Error');

//restream parsed body before proxying
apiProxy.on('proxyReq', function (proxyReq, req, res, options) {
    if (req.body) {
        let bodyData = JSON.stringify(req.body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        // stream the content
        proxyReq.write(bodyData);
    }
});


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

    routeToRandomServiceInstance(needServiceName) {
        let serviceList = this.getServiceList(needServiceName);
        if(serviceList === false){
            return false;
        }else{
            return Object.assign(new ServiceList(),serviceList).getRandomService();
        }
    }

    proxyToRandom(req, res){
        let routeService = this.routeToRandomServiceInstance(req.params.needServiceName);
        if (routeService === false) {
            res.status(400).json(new Error('Der angeforderte Service exitiert unter diesem Namen aktuell nicht'));
        }else{
            apiProxy.web(req, res,
                {
                    target: `${routeService.serviceUrl}`, agent: https.globalAgent, https: true,
                    proxyTimeout: 12000, changeOrigin: true
                },
                function (e, ereq, eres, url) {
                    res.status(502).json(new Error(`${e.message} Timeout ${req.params.needServiceName} Fehler beim Anfordern der Ressourcen`));
                });
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