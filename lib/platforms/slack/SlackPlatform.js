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
            .on('message', this.onMessage.bind(this))
            .start();
    }

    createSession(options, formatter) {
        return new SlackSession(options, formatter);
    }

    onMessage(message) {
        // console.log(message);

        if (message === undefined || message.text === undefined) {
            return;
        }

        if (!(message.type === 'message' && Boolean(message.text) &&
            typeof message.channel === 'string' && message.channel[0] === 'C')) {
            return;
        }

        this.parent.execute({
            bot: this.bot,
            message: message,
            args: message.text
        })
            .catch((ex) => {
                console.error(ex);
            });
    }
}

module.exports = SlackPlatform;
