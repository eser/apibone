class CliSession {
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
    }
}

module.exports = CliSession;
