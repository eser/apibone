const SlackBot = require('slackbots'),
    config = require('../../../config.js'),
    SlackSession = require('./SlackSession.js');

class SlackPlatform {
    constructor(apiBone) {
        this.parent = apiBone;
        this.defaultFormatter = 'markdown';

        this.bot = new SlackBot({
            token: config.slack.botToken,
            name: config.slack.name
        })
            .on('message', this.onMessage.bind(this));
    }

    createSession(options, formatter) {
        return new SlackSession(options, formatter);
    }

    onMessage(message) {
        // console.log(message);

        if (message === undefined) {
            return;
        }

        // ensure that it's a regular message
        if (message.type !== 'message' || message.subtype !== undefined) {
            return;
        }

        // ensure that the originator is not a bot
        const fromUser = this.bot.users.filter(x => x.id === message.user);

        if (fromUser[0].is_bot || fromUser[0].id === this.bot.self.id) {
            return;
        }

        this.parent.execute({
            bot: this.bot,
            message: message,
            args: message.text,
            forceResponse: false
        })
            .catch((ex) => {
                console.error(ex);
            });
    }
}

module.exports = SlackPlatform;
