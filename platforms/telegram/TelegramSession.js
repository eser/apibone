class TelegramSession {
    constructor(formatter, options) {
        this.formatter = formatter;
        this.options = options;
    }

    log(text) {
        const message = this.options.message;

        const response = {
            chat_id: message.chat.id,
            reply_to_message_id: message.message_id,
            text: text,
            parse_mode: 'Markdown'
        };

        this.options.bot.sendMessage(response);
    }

    error(ex) {
        console.error(ex);
    }

    end() {
    }
}

module.exports = TelegramSession;
