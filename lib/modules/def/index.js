const NumberUtils = require('../../utils/NumberUtils.js'),
    config = require('../../../config.js');

const defaultResponses = config.def.default || [ 'no such thing - $0' ];

const dictionary = [];

if (config.def !== undefined) {
    for (let regex in config.def) {
        if (regex[0] !== '^') {
            dictionary.push({
                pattern: new RegExp('^' + regex, 'i'),
                responses: config.def[regex]
            });
        }
    }

    for (let regex in config.def) {
        dictionary.push({
            pattern: new RegExp(regex, 'i'),
            responses: config.def[regex]
        });
    }
}

function defCommand(argv, session) {
    function respond(responses) {
        let response = responses[NumberUtils.getRandomInt(0, responses.length - 1)];

        return Promise.resolve({
            response: response,
            responseReplace: true,
            formatText: (result) => { session.log(result); },
            formatMarkdown: (result) => { session.log(result); },
            formatJson: (result) => { session.log(result); }
        });
    }

    function noResponse() {
        return Promise.resolve(null);
    }

    for (let item of dictionary) {
        const result = item.pattern.exec(argv._.join(' '));

        if (result === null) {
            continue;
        }

        return respond(item.responses);
    }

    if (!session.options.forceResponse) {
        return noResponse();
    }

    return respond(defaultResponses);
}

apiBone.addCommand({
    command: 'def',
    description: 'Defines things',
    usage: 'def thing',
    demandArgs: 1,
    demandOptions: [ ],
    callback: defCommand
});
