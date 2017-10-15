const TelegramBot = require('node-telegram-bot-api'),
    config = require('../../../config.js'),
    TelegramSession = require('./TelegramSession.js');

class TelegramPlatform {
    constructor(apiBone) {
        this.parent = apiBone;

        this.bot = new TelegramBot(
            config.telegram.botToken,
            {
                polling: true,
            }
        );

        this.bot.on('message', this.onMessage.bind(this));
    }

    createSession(options) {
        return new TelegramSession(options);
    }

    validateInput(input) {
        let newInput = Object.assign({}, input);

        if (newInput.type === 'text') {
            if (newInput.text[0] === '/') {
                newInput.type = 'command';
                newInput.text = newInput.text.substr(1);
            }
        }

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
            type: 'text',
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
