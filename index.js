const express = require('express');
const app = express();
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const apiProxy = httpProxy.createProxyServer();
const homeSeiteService = 'http://localhost:8087';
const Router = require('./classes/Router');
const Error = require('./classes/Error')
const routerObj = new Router();

/**Eventuell gebraucht 
app.use(bodyParser.urlencoded({
    extended: true
}));
*/

app.use(bodyParser.json());

app.listen(80, function () {
    console.log("APIGateway");
});

/**
 * Verweist auf den HomeSeiteService, um die Daten der OpenWeatherAPI
 * und der RMV API (DepartureBoard Industriehof) zu beziehen
 */
app.all('/APIGateway/Router/:needServiceName', function (req, res) {
    let routeService = routerObj.route(req.params.needServiceName);
    if (routeService == false) {
        res.json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'));
    }
    apiProxy.web(req, res, { target: ` ${routeService.serviceUrl}:${routeService.servicePort} ` }, function (e) {
        res.json(new Error(`Timeout ${req.params.needServiceName} Fehler beim Anfordern der Ressourcen`));
    });
});

app.post('/APIGateway/ServiceRegister', function (req, res) {
    if (routerObj.addServiceList(req.body.serviceName) == true) {
        res.json(routerObj.domain[routerObj.domain.length - 1].addServiceInstance(req.body.serviceUrl, req.body.servicePort));
    } else {
        res.json(routerObj.getServiceList(req.body.serviceName).addServiceInstance(req.body.serviceUrl, req.body.servicePort));
    }
});

app.get('/APIGateway/ServiceRegister/:needServiceName', function (req, res) {
    let serviceList = routerObj.getServiceList(req.params.needServiceName) != false ? res.json(serviceList) : res.json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'))
});

app.get('/APIGateway/ServiceRegister/:needServiceName/:needServiceId', function (req, res) {
    let serviceList = routerObj.getServiceList(req.params.needServiceName) != false ? res.json(serviceList) : res.json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'))
    if (serviceList != false) {
        let serviceInstance = serviceList.getServiceInstance(req.params.needServiceId);
        if(serviceInstance != false){
            res.json(serviceInstance);
        }else{
            res.json(new Error("Service mit der Service-ID wurde nicht gefunden"));
        }
    }else{
        res.json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'));
    }
});

app.get('/APIGateway/ServiceRegister', function (req, res) {
    res.json(routerObj);
});