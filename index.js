const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Router = require('./classes/Router');

const ServiceList = require('./classes/ServiceList');

const routerObj = Router.readFromJSON();


app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", req.getHeader);
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
            routerObj.saveInJSON();
            res.status(200).json(routerObj.domain[routerObj.domain.length - 1].addServiceInstance(req.body.serviceUrl, req.body.servicePort));
        } else {
            let servicelist = Object.assign(new ServiceList(),routerObj.getServiceList(req.body.serviceName));
            let serviceInstance = servicelist.addServiceInstance(req.body.serviceUrl, req.body.servicePort);
            if ( serviceInstance == false) {
                res.status(200).json(servicelist.getServiceInstanceWithURLAndPort(req.body.serviceUrl, req.body.servicePort));
            } else {
                routerObj.saveInJSON();
                res.status(200).json(serviceInstance);
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
app.get('/APIGateway/ServiceRegister/:needServiceName/:needServiceId',function (req, res) {
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

app.delete('/APIGateway/ServiceRegister/:needServiceName/:needServiceId',function (req, res) {
    if (req.query.password == 'leftlovers_wwi16B3') {
        let serviceList = Object.assign(new ServiceList(),routerObj.getServiceList(req.params.needServiceName));
        if (serviceList != false) {
            if(serviceList.serviceInstances.length==1){
                routerObj.deleteServiceList(req.params.needServiceName);
                routerObj.saveInJSON();
                res.status(200).json("Service Instanz und Service Liste gelöscht");
            }else{
                serviceList.deleteServiceInstance(req.params.needServiceId);
                routerObj.saveInJSON();
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
app.route('/:needServiceName/*')
.get(function (req, res) {
    routerObj.proxyToRandom(req,res)
})
.post(function (req, res) {
    routerObj.proxyToRandom(req,res)
})
.put(function (req, res) {
    routerObj.proxyToRandom(req,res)
})
.delete(function (req, res) {
    routerObj.proxyToRandom(req,res)
})
