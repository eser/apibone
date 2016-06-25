module.exports = {
    aliases: {
        'bot': 'def bot'
    },
    telegram: {
        botToken: ''
    },
    openweathermap: {
        apiKey: ''
    },
    def: {
        '^bot': [ 'i\'m a $0!' ],
        default: [ 'dunno - $0' ]
    }
};
