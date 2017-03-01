const fs = require('fs'),
    EventEmitter = require('events').EventEmitter;

class SlackSession {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;

        this.events = new EventEmitter();
        this.output = [];
    }

    log(text) {
        this.output.push(text);
    }

    voice(options) {
        console.log(`** voice is not supported - ${options.sourceUrl}`);
    }

    error(ex) {
        this.output.push(ex.message);
    }

    end() {
        const message = this.options.message;

        this.options.bot.postMessageToChannel(
            message.channel,
            this.output.join('\n'),
            { as_user: true }
        );

        this.events.emit('end');
    }
}

module.exports = SlackSession;
