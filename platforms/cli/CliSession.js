class CliSession {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;
    }

    log(text) {
        console.log(text);
    }

    end() {
    }
}

module.exports = CliSession;
