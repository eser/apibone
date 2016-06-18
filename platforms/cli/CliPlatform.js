const CliSession = require('./CliSession.js');

class CliPlatform {
    constructor() {
        this.defaultFormatter = 'text';
    }

    createSession(options, formatter) {
        return new CliSession(options, formatter);
    }
}

module.exports = CliPlatform;
