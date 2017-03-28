const config = require('../../../config.js');

const dictionary = [],
    commands = {};

if (config.responder !== undefined) {
    for (let regex in config.responder.dictionary) {
        if (regex[0] !== '^') {
            dictionary.push({
                pattern: new RegExp('^' + regex, 'i'),
                responses: config.responder.dictionary[regex]
            });
        }
    }

    for (let regex in config.responder.dictionary) {
        dictionary.push({
            pattern: new RegExp(regex, 'i'),
            responses: config.responder.dictionary[regex]
        });
    }

    for (let command in config.responder.commands) {
        commands[command] = config.responder.commands[command];
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

function responderListener(args, session) {
    for (let item of dictionary) {
        const result = item.pattern.exec(args);

        if (result === null) {
            continue;
        }

        return _respond(item.responses, session);
    }

    return _noResponse(session);
}

function responderCommand(argv, session) {
    const command = argv._[0];

    return _respond(commands[command], session);
}

apiBone.addListener(responderListener);

for (let command in commands) {
    apiBone.addCommand({
        command: command,
        description: '',
        usage: command,
        demandArgs: 0,
        demandOptions: [ ],
        callback: responderCommand
    });
}
