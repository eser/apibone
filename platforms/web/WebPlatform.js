const WebSession = require('./WebSession.js');

class WebPlatform {
    constructor() {
        this.defaultFormatter = 'json';
    }

    createSession(options, formatter) {
        return new WebSession(options, formatter);
    }
}

module.exports = WebPlatform;
