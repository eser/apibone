const SlackBot = require('slackbots'),
    config = require('../../../config.js'),
    SlackSession = require('./SlackSession.js');

class SlackPlatform {
    constructor(apiBone) {
        this.parent = apiBone;

        this.bot = new SlackBot({
            token: config.slack.botToken,
            name: config.slack.name
        })
            .on('message', this.onMessage.bind(this));
    }

    createSession(options) {
        return new SlackSession(options);
    }

    validateInput(input) {
        let newInput = Object.assign({}, input);

        if (newInput.type === 'text') {
            if (newInput.text.substr(0, 2) === '--') {
                newInput.type = 'command';
                newInput.text = newInput.text.substr(2);
            }
        }

        return newInput;
    }

    onMessage(message) {
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

        const input = {
            type: 'text',
            text: message.text,
            direct: false
        };

        this.parent.execute({
            input: input,
            bot: this.bot,
            message: message
        })
            .catch((ex) => {
                console.error(ex);
            });
    }
}

module.exports = SlackPlatform;
