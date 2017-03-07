const EventEmitter = require('events').EventEmitter;

class CliSession {
    constructor(options) {
        this.options = options;

        this.events = new EventEmitter();
    }

    sendText(text) {
        console.log(text);
    }

    sendAudio(options) {
        console.log(`** audio is not supported - ${options.sourceUrl}`);
    }

    error(ex) {
        console.error(ex.message);

        return Promise.resolve();
    }

    end() {
        this.events.emit('end');
    }
}

module.exports = CliSession;
