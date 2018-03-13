const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const httpProxy = require('http-proxy');
const apiProxy = httpProxy.createProxyServer();

const Router = require('./classes/Router');
const Error = require('./classes/Error');
const https = require('https');

const ServiceList = require('./classes/ServiceList');

const fs = require('fs');
const jsonSaveFile = './router.json';
const jsonSaveFileObj = require(jsonSaveFile);
const routerObj = new Router();
routerObj.domain = jsonSaveFileObj.domain;

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


app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.listen(process.env.PORT || 3000, function () {
    console.log("APIGateway", this.address().port, app.settings.env);
});

app.get('/APIGateway', function (req, res) {
    res.status(200).json("API Call Test");
});

app.get('/APIGateway/ServiceRegister', function (req, res) {
    res.status(200).json(routerObj);
});

app.post('/APIGateway/ServiceRegister', function (req, res) {
    if (req.query.password == 'leftlovers_wwi16B3') {
        if (routerObj.addServiceList(req.body.serviceName) == true) {
            fs.writeFile(jsonSaveFile, JSON.stringify(routerObj), 'utf8',(err) => {});
            res.status(200).json(routerObj.domain[routerObj.domain.length - 1].addServiceInstance(req.body.serviceUrl, req.body.servicePort));
        } else {
            let servicelist = Object.assign(new ServiceList(),routerObj.getServiceList(req.body.serviceName));
            if (servicelist.addServiceInstance(req.body.serviceUrl, req.body.servicePort) == false) {
                res.status(200).json(servicelist.getServiceInstanceWithURLAndPort(req.body.serviceUrl, req.body.servicePort));
            } else {
                fs.writeFile(jsonSaveFile, JSON.stringify(routerObj), 'utf8',(err) => {});
                res.status(200).json(servicelist.addServiceInstance(req.body.serviceUrl, req.body.servicePort));
            }
        }
    } else {
        res.status(400).json(new Error('Falsches Passwort'))
    }
});

app.get('/APIGateway/ServiceRegister/:needServiceName', function (req, res) {
    let serviceList = routerObj.getServiceList(req.params.needServiceName);
    if (serviceList != false) {
        res.status(200).json(serviceList);
    } else {
        res.status(400).json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'));
    }
});

app.get('/APIGateway/ServiceRegister/:needServiceName/:needServiceId', function (req, res) {
    let serviceList = Object.assign(new ServiceList(),routerObj.getServiceList(req.params.needServiceName));
    if (serviceList != false) {
        let serviceInstance = serviceList.getServiceInstance(req.params.needServiceId);
        if (serviceInstance != false) {
            res.status(200).json(serviceInstance);
        } else {
            res.status(400).json(new Error("Service mit der Service-ID wurde nicht gefunden"));
        }
    } else {
        res.status(400).json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'));
    }
});

app.delete('/APIGateway/ServiceRegister/:needServiceName/:needServiceId', function (req, res) {
    if (req.query.password == 'leftlovers_wwi16B3') {
        let serviceList = Object.assign(new ServiceList(),routerObj.getServiceList(req.params.needServiceName));
        if (serviceList != false) {
            if(serviceList.serviceInstances.length==1){
                routerObj.deleteServiceList(req.params.needServiceName);
                fs.writeFile(jsonSaveFile, JSON.stringify(routerObj), 'utf8',(err) => {});
                res.status(200).json("Service Instanz und Service Liste gelöscht");
            }else{
                serviceList.deleteServiceInstance(req.params.needServiceId);
                fs.writeFile(jsonSaveFile, JSON.stringify(routerObj), 'utf8',(err) => {});
                res.status(200).json("Service Instanz gelöscht");
            }
            
        } else {
            res.status(400).json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'));
        }
    } else {
        res.status(400).json(new Error('Falsches Passwort'));
    }
});



//Schnittstelle für services
app.all('/:needServiceName/*', function (req, res) {
    let routeService = routerObj.route(req.params.needServiceName);
    if (routeService == false) {
        res.status(400).json(new Error('Der angeforderte Service exitiert unter diesem Namen aktuell nicht'));
    }
    apiProxy.web(req, res,
        {
            target: `${routeService.serviceUrl}`, agent: https.globalAgent, https: true,
            proxyTimeout: 12000, changeOrigin: true
        },
        function (e, ereq, eres, url) {
            res.status(502).json(new Error(`${e.message} Timeout ${req.params.needServiceName} Fehler beim Anfordern der Ressourcen`));
        });
});
