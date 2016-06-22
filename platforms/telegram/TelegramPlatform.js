const TelegramBot = require('node-telegram-bot'),
    config = require('../../config.js'),
    TelegramSession = require('./TelegramSession.js');

class TelegramPlatform {
    constructor(apiBone) {
        this.parent = apiBone;
        this.defaultFormatter = 'markdown';

        this.bot = new TelegramBot({
            token: config.telegram.botToken
        })
            .on('message', this.onMessage.bind(this))
            .start();
    }

    createSession(options, formatter) {
        return new TelegramSession(options, formatter);
    }

    onMessage(message) {
        console.log(message);

        if (message === undefined || message.text === undefined) {
            return;
        }

        this.parent.execute({
            bot: this.bot,
            message: message,
            args: message.text.replace(/—/g, '--')
        })
            .catch((ex) => {
                console.error(ex);
            });
    }
}

module.exports = TelegramPlatform;
