'use strict';

class Error{
    constructor(errorMessage) {
        this.serviceId = 1;
        this.errorMessage = errorMessage;
    }
}
module.exports = Error;