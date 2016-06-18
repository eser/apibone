const Readable = require('stream').Readable;

class WebSession {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;
        this.buffer = null;
    }

    log(text) {
        if (this.buffer === null) {
            if (text.constructor === String) {
                this.buffer = '';
            }
            else {
                this.buffer = text;
            }
        }

        if (this.buffer.constructor === String) {
            this.buffer += `${text}\n`;
        }
    }

    end() {
        if (this.formatter === 'json') {
            this.options.response.json(this.buffer);
        }
        else {
            this.options.response.send(this.buffer);
        }
    }
}

module.exports = WebSession;
