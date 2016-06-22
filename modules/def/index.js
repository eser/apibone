const NumberUtils = require('../../utils/NumberUtils.js'),
    config = require('../../config.js');

const defaultResponses = [ 'no such thing - $0' ];

function defCommand(argv, session) {
    function respond(responses, replacements) {
        let response = responses[NumberUtils.getRandomInt(0, responses.length - 1)];

        for (let replacement in replacements) {
            response = response.replace(new RegExp('\\$' + replacement, 'g'), replacements[replacement]);
        }

        return Promise.resolve({
            response: response,
            formatText: (result) => { session.log(result); },
            formatMarkdown: (result) => { session.log(result); },
            formatJson: (result) => { session.log(result); }
        });
    }

    const input = argv._;

    if (config.def !== undefined) {
        for (let regex in config.def) {
            const pattern = new RegExp(regex, 'i'),
                responses = config.def[regex],
                result = pattern.exec(input.join(' '));

            if (result === null) {
                continue;
            }

            return respond(responses, input);
        }

        if (config.def.default !== undefined) {
            return respond(config.def.default, input);
        }
    }

    return respond(defaultResponses, input);
}

apiBone.addCommand({
    command: 'def',
    description: 'Defines things',
    usage: 'def thing',
    demandArgs: 1,
    demandOptions: [ ],
    callback: defCommand
});
