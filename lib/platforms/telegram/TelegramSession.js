const fs = require('fs'),
    EventEmitter = require('events').EventEmitter;

class TelegramSession {
    constructor(options) {
        this.options = options;

        this.events = new EventEmitter();
        this.output = [];
    }

    sendText(text) {
        this.output.push(text);
    }

    sendAudio(options) {
        const message = this.options.message;

        const response = {
            chat_id: message.chat.id,
            files: {
                filename: options.filename,
                contentType: options.contentType,
                stream: fs.createReadStream(options.audioFile)
            },
            reply_to_message_id: message.message_id
        };

        this.options.bot.sendAudio(response);
    }

    error(ex) {
        this.output.push(ex.message);

        return Promise.resolve();
    }

    end() {
        const message = this.options.message;

        const response = {
            chat_id: message.chat.id,
            reply_to_message_id: message.message_id,
            text: this.output.join('\n'),
            parse_mode: 'Markdown'
        };

        this.options.bot.sendMessage(response);

        this.events.emit('end');
    }
}

module.exports = TelegramSession;
