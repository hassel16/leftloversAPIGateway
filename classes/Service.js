'use strict';

class Service{
    constructor(serviceId,serviceUrl,servicePort) {
        this.serviceId = serviceId;
        this.serviceUrl = serviceUrl;
        this.servicePort = servicePort;
    }
}
module.exports = Service;