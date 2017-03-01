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

// kanal - @eserbot /ov eser
// { type: 'message',
//   channel: 'G2F8G40Q7',
//   user: 'U26MWEANA',
//   text: '<@U4D0NQQLW> /ov eser', 
//   ts: '1488403297.000010',
//   team: 'T26MWEAJJ' }

// ozel
// { type: 'message',
//   channel: 'D4D2464CF',
//   user: 'U26MWEANA',
//   text: 'ov eser',
//   ts: '1488403359.000004',
//   team: 'T26MWEAJJ' }

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
