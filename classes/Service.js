'use strict';

class Service{
    constructor(serviceId,serviceAdress,servicePort) {
        this.serviceId = serviceId;
        this.serviceAdress = serviceAdress;
        this.servicePort = servicePort;
    }
}
module.exports = Service;