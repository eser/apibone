const EventEmitter = require('events').EventEmitter;

class CliSession {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;

        this.events = new EventEmitter();
    }

    log(text) {
        console.log(text);
    }

    voice(options) {
        console.log(`** voice is not supported - ${options.sourceUrl}`);
    }

    error(ex) {
        console.error(ex.message);
    }

    end() {
        this.events.emit('end');
    }
}

module.exports = CliSession;
