const NumberUtils = require('../../utils/NumberUtils.js'),
    config = require('../../../config.js');

const dictionary = [],
    commands = {};

if (config.def !== undefined) {
    for (let regex in config.def.dictionary) {
        if (regex[0] !== '^') {
            dictionary.push({
                pattern: new RegExp('^' + regex, 'i'),
                responses: config.def.dictionary[regex]
            });
        }
    }

    for (let regex in config.def.dictionary) {
        dictionary.push({
            pattern: new RegExp(regex, 'i'),
            responses: config.def.dictionary[regex]
        });
    }

    for (let command in config.def.commands) {
        commands[command] = config.def.commands[command];
    }
}

function _respond(responses, session) {
    let response = responses[NumberUtils.getRandomInt(0, responses.length - 1)];

    return Promise.resolve({
        response: response,
        responseReplace: true,
        formatPlain: (result) => { session.sendText(result); },
        formatMarkdown: (result) => { session.sendText(result); },
        formatJson: (result) => { session.sendText(result); }
    });
}

function _noResponse(session) {
    return Promise.resolve(null);
}

function defListener(args, session) {
    for (let item of dictionary) {
        const result = item.pattern.exec(args);

        if (result === null) {
            continue;
        }

        return _respond(item.responses, session);
    }

    return _noResponse(session);
}

function defCommand(argv, session) {
    const command = argv._[0];

    return _respond(commands[command], session);
}

apiBone.addListener(defListener);

for (let command in commands) {
    apiBone.addCommand({
        command: command,
        description: '',
        usage: command,
        demandArgs: 0,
        demandOptions: [ ],
        callback: defCommand
    });
}
