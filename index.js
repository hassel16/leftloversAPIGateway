const express = require('express');
const app = express();
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const apiProxy = httpProxy.createProxyServer();
const homeSeiteService = 'http://localhost:8087';
const Router = require('./classes/Router');
const Error = require('./classes/Error');

const routerObj = new Router();

const fs = require('fs');
const jwt = require('jsonwebtoken');
const ownToken = require('./classes/Token');

/**Eventuell gebraucht 
app.use(bodyParser.urlencoded({
    extended: true
}));
*/

app.use(bodyParser.json());

app.listen(80, function () {
    console.log("APIGateway");
});


app.get('/APIGateway/ServiceRegister/:needServiceName/:needServiceId', function (req, res) {
    let serviceList = routerObj.getServiceList(req.params.needServiceName) != false ? res.status(200).json(serviceList) : res.status(400).json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'))
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

app.get('/APIGateway/ServiceRegister/:needServiceName', function (req, res) {
    let serviceList = routerObj.getServiceList(req.params.needServiceName);
    if (serviceList != false) {
        res.status(200).json(serviceList);
    } else {
        res.status(400).json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'));
    }
});

app.get('/APIGateway/ServiceRegister', function (req, res) {
    res.status(200).json(routerObj);
});


app.post('/APIGateway/ServiceRegister', function (req, res) {
    if (req.query.password == 'leftlovers_wwi16B3') {
        if (routerObj.addServiceList(req.body.serviceName) == true) {
            res.status(200).json(routerObj.domain[routerObj.domain.length - 1].addServiceInstance(req.body.serviceUrl, req.body.servicePort));
        } else {
            res.status(200).json(routerObj.getServiceList(req.body.serviceName).addServiceInstance(req.body.serviceUrl, req.body.servicePort));
        }
    } else {
        res.status(400).json(new Error('Falsches Passwort'))
    }

});


//Schnittstelle innen für services
app.all('/:needServiceName/*', function (req, res) {
    let routeService = routerObj.route(req.params.needServiceName);
    if (routeService == false) {
        res.status(400).json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'));
    }
    console.log("asdasd")
    apiProxy.web(req, res,
        { target: `${routeService.serviceUrl}:${routeService.servicePort}`}, function (e) {
            res.status(400).json(new Error(`Timeout ${req.params.needServiceName} Fehler beim Anfordern der Ressourcen`));
        });
});
