const NumberUtils = require('../../utils/NumberUtils.js'),
    config = require('../../config.js');

const defaultResponses = [ 'no such thing - $0' ];

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

    if (config.def !== undefined) {
        for (let regex in config.def) {
            const pattern = new RegExp(regex, 'i'),
                responses = config.def[regex],
                result = pattern.exec(argv._.join(' '));

            if (result === null) {
                continue;
            }

            return respond(responses);
        }

        if (config.def.default !== undefined) {
            return respond(config.def.default);
        }
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
