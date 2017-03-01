const fs = require('fs'),
    EventEmitter = require('events').EventEmitter;

class SlackSession {
    constructor(options, formatter) {
        this.options = options;
        this.formatter = formatter;

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

        this._sendMessage(message.channel, this.output.join('\n'));

        this.events.emit('end');
    }

    _sendMessage(targetId, text) {
        const channels = this.options.bot.channels.filter(x => x.id === targetId);

        if (channels.length > 0) {
            this.options.bot.postMessageToChannel(
                channels[0].name,
                text,
                { as_user: true }
            );

            return;
        }

        const groups = this.options.bot.groups.filter(x => x.id === targetId);

        if (groups.length > 0) {
            this.options.bot.postMessageToGroup(
                groups[0].name,
                text,
                { as_user: true }
            );

            return;
        }

        const ims = this.options.bot.ims.filter(x => x.id === targetId);

        if (ims.length > 0) {
            const toUser = this.options.bot.users.filter(x => x.id === ims[0].user);

            this.options.bot.postMessageToUser(
                toUser[0].name,
                text,
                { as_user: true }
            );

            return;
        }
    }
}

module.exports = SlackSession;
