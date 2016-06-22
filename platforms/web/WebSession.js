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

    voice(filename, contentType, stream) {
    }

    error(ex) {
        this.options.response.status(500)
            .json({
                exception: {
                    name: ex.name,
                    message: ex.message
                }
            });
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
