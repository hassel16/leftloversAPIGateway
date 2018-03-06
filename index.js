const express = require('express');
const app = express();
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const apiProxy = httpProxy.createProxyServer();
const homeSeiteService = 'http://localhost:8087';
const Router= require('./classes/Router');
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
app.all("/HomeSeiteService", function (req, res) {
    apiProxy.web(req, res, { target: homeSeiteService });
});

app.post('/ServiceRegister', function (req, res) {
    if(routerObj.addServiceList(req.body.serviceName)==true){
        res.json(routerObj.domain[routerObj.domain.length-1].addServiceInstance(req.body.serviceUrl, req.body.servicePort));
    }else{
        res.json(routerObj.getServiceList(req.body.serviceName).addServiceInstance(req.body.serviceUrl, req.body.servicePort));
    }
});

app.get('/ServiceRegister', function (req, res) {
        res.json(routerObj);
});