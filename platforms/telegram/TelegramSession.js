const fs = require('fs'),
    EventEmitter = require('events').EventEmitter;

class TelegramSession extends EventEmitter {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;
        this.output = [];
    }

    log(text) {
        this.output.push(text);
    }

    voice(options) {
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

        this.emit('end');
    }
}

module.exports = TelegramSession;
