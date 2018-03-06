var express = require('express');
var app = express();
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var homeSeiteService = 'http://localhost:8087',
    verkehrsmittelSeiteService = 'http://localhost:8089',
    pinnwandSeiteService = 'http://localhost:8098',
    authMobileService = 'http://localhost:8083';

/**
 * Verweist auf den HomeSeiteService, um die Daten der OpenWeatherAPI
 * und der RMV API (DepartureBoard Industriehof) zu beziehen
 */
app.all("/HomeSeiteService", function (req, res) {
    apiProxy.web(req, res, { target: homeSeiteService });
});

/**
 * Verweist auf den VerkehrsmittelSeiteService, um die entsprechenden
 * Daten der RMV(Industriehof <> HBF) oder des ADAC(Stau) auszulesen 
 */
app.all("/VerkehrsmittelSeiteService/*", function (req, res) {
    apiProxy.web(req, res, { target: verkehrsmittelSeiteService });
});
/**
 * Verweist auf den AuthMobileAppService, 
 * um einzuloggen, einen vorhandenen Token zu checken oder auszuloggen
 */
app.all("/AuthMobileAppService/*", function (req, res) {
    apiProxy.web(req, res, { target: authMobileService });
});

app.all("/PinnwandSeiteService/*", function (req, res) {
    apiProxy.web(req, res, { target: pinnwandSeiteService });
});


app.listen(80);