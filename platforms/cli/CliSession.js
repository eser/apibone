const EventEmitter = require('events').EventEmitter;

class CliSession extends EventEmitter {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;
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
        this.emit('end');
    }
}

module.exports = CliSession;
