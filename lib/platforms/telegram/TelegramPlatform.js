const TelegramBot = require('node-telegram-bot'),
    config = require('../../../config.js'),
    TelegramSession = require('./TelegramSession.js');

class TelegramPlatform {
    constructor(apiBone) {
        this.parent = apiBone;

        this.bot = new TelegramBot({
            token: config.telegram.botToken
        })
            .on('message', this.onMessage.bind(this))
            .start();
    }

    createSession(options) {
        return new TelegramSession(options);
    }

    validateInput(input) {
        let newInput = Object.assign({}, input);

        if (newInput.type === 'command') {
            const splitted = newInput.text.split(' '),
                atPos = splitted[0].indexOf('@');

            if (atPos > 0) {
                splitted[0] = splitted[0].substr(0, atPos);
                newInput.text = splitted.join(' ');
            }
        }

        return newInput;
    }

    onMessage(message) {
        if (message === undefined || message.text === undefined) {
            return;
        }

        const input = {
            type: 'command',
            text: message.text.replace(/—/g, '--'),
            direct: true
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

module.exports = TelegramPlatform;
