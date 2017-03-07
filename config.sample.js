module.exports = {
    aliases: {
        'bot': 'def bot'
    },
    telegram: {
        botToken: ''
    },
    slack: {
        botToken: '',
        name: 'eserbot'
    },
    openweathermap: {
        apiKey: ''
    },
    def: {
        '^bot': [ 'i\'m a $0!' ],
        'praise': [ '$0* is awesome' ],
        'damn': [ 'damnit $0*' ],
        default: [ 'dunno - $0' ]
    }
};
