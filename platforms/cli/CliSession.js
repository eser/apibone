class CliSession {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;
    }

    log(text) {
        console.log(text);
    }

    error(ex) {
        console.error(ex);
    }

    end() {
    }
}

module.exports = CliSession;
