const WebSession = require('./WebSession.js');

class WebPlatform {
    constructor(apiBone) {
        this.parent = apiBone;
    }

    createSession(options) {
        return new WebSession(options);
    }

    validateInput(input) {
        return input;
    }
}

module.exports = WebPlatform;
