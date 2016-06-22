class CliSession {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;
    }

    log(text) {
        console.log(text);
    }

    voice(filename, contentType, stream) {
    }

    error(ex) {
        console.error(ex.message);
    }

    end() {
    }
}

module.exports = CliSession;
