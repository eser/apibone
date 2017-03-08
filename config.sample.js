module.exports = {
    aliases: {
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
    responder: {
        dictionary: {
            '^eserbot': [ 'i\'m a $0!' ]
        },
        commands: {
            'praise': [ '$0* is awesome' ],
            'damn': [ 'damnit $0*' ]
        }
    },
    quotes: {
        'shakespeare': [
            'Be not afraid of greatness: some are born great, some achieve greatness, and some have greatness thrust upon them.',
            'To thine own self be true, and it must follow, as the night the day, thou canst not then be false to any man.',
            'The course of true love never did run smooth.',
            'There is nothing either good or bad, but thinking makes it so.',
            'Love looks not with the eyes, but with the mind; and therefore is winged Cupid painted blind.',
            'Cowards die many times before their deaths; the valiant never taste of death but once.',
            'If music be the food of love, play on.',
            'Love all, trust a few, do wrong to none.',
            'Life ... is a tale Told by an idiot, full of sound and fury, Signifying nothing.',
            'Men at some time are the masters of their fates: The fault, dear Brutus, is not in our stars, but in ourselves, that we are underlings.'
        ]
    }
};
