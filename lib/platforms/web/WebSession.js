const Readable = require('stream').Readable,
    EventEmitter = require('events').EventEmitter;

class WebSession {
    constructor(options, formatter) {
        this.options = options;
        this.formatter = formatter;

        this.buffer = null;
        this.events = new EventEmitter();
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

    voice(options) {
        this.options.response.status(501)
            .send(`** voice is not supported - ${options.sourceUrl}`);
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

        this.events.emit('end');
    }
}

module.exports = WebSession;
