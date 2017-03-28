const config = require('../../../config.js');

const quotes = [];

if (config.quotes !== undefined) {
    for (let quote in config.quotes) {
        quotes[quote] = config.quotes[quote];
    }
}

function _respond(responses, session) {
    return Promise.resolve({
        response: responses,
        responseReplace: true,
        formatPlain: (result) => { session.sendText(result); },
        formatMarkdown: (result) => { session.sendText(result); },
        formatJson: (result) => { session.sendText(result); }
    });
}

function _noResponse(session) {
    return Promise.resolve(null);
}

function quoteCommand(argv, session) {
    const quote = argv._.slice(1).join(' ').trim();

    if (quote in quotes) {
        return _respond(quotes[quote], session);
    }

    return _noResponse(session);
}

apiBone.addCommand({
    command: 'quote',
    description: 'Generates a quote related with the given context',
    usage: 'quote shakespeare',
    demandArgs: 1,
    demandOptions: [ ],
    callback: quoteCommand
});
