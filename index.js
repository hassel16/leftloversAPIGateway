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
const ownToken= require('./classes/Token');

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
    let serviceList = routerObj.getServiceList(req.params.needServiceName) != false ? res.status(200).json(serviceList) : res.status(400).json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'))
});

app.get('/APIGateway/ServiceRegister', function (req, res) {
    res.status(200).json(routerObj);
});


app.post('/APIGateway/ServiceRegister', function (req, res) {
    if (req.query.password == 'leftlovers_wwi16B3') {
        jwt.sign(
            { foo: 'leftlovers_wwi16B3'},'levtlovers_wwi16B3', function (err, token) {
                if(err){
                    res.status(400).json(new Error('Fehler'));
                }else{
                    if (routerObj.addServiceList(req.body.serviceName) == true) {
                        res.status(200).json([routerObj.domain[routerObj.domain.length - 1].addServiceInstance(req.body.serviceUrl, req.body.servicePort), new ownToken(token)]);
                    } else {
                        res.status(200).json([routerObj.getServiceList(req.body.serviceName).addServiceInstance(req.body.serviceUrl, req.body.servicePort), new ownToken(token)]);
                    }
                }
            });
    } else {
        res.status(400).json(new Error('Falsches Passwort'))
    }

});


//Schnittstelle innen für services
app.all('/:needServiceName/*', function (req, res) {
    // verify a token asymmetric
    let token = req.query.token;
    jwt.verify(token,'levtlovers_wwi16B3',{ expiresIn: '1 Day' }, function (err, decoded) {
        if(err){
            res.status(400).json(new Error(`Fehlerhafter Token: ${err.name}: ${err.message}`));
        }else{
            let routeService = routerObj.route(req.params.needServiceName);
            if (routeService == false) {
                res.status(400).json(new Error('Der angeforderte Service exitiert aktuell unter diesem Namen nicht'));
            }
            apiProxy.web(req, res, 
                { target: `${routeService.serviceUrl}:${routeService.servicePort}` }, function (e) {
                res.status(400).json(new Error(`Timeout ${req.params.needServiceName} Fehler beim Anfordern der Ressourcen`));
            });
        }
    });
});
