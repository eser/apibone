class TelegramSession {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;
        this.output = [];
    }

    log(text) {
        this.output.push(text);
    }

    voice(filename, contentType, stream) {
        const message = this.options.message;

        const response = {
            chat_id: message.chat.id,
            files: {
                filename: filename,
                contentType: contentType,
                stream: stream
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
    }
}

module.exports = TelegramSession;
