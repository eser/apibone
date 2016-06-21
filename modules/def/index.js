const NumberUtils = require('../../utils/NumberUtils.js'),
    config = require('../../config.js');

const defaultResponses = [ 'no such thing - $0' ];

class DefModule {
    constructor(apiBone) {
        this.parent = apiBone;
    }

    respond(responses, replacements) {
        let response = responses[NumberUtils.getRandomInt(0, responses.length - 1)];

        for (let replacement in replacements) {
            response = response.replace(new RegExp('\\$' + replacement, 'g'), replacements[replacement]);
        }

        return Promise.resolve(response);
    }

    execute(argv) {
        if (argv._.length < 1) {
            return Promise.reject(new Error(`needs a parameter to query`));
        }

        const input = argv._.join(' ');

        if (config.def !== undefined) {
            for (let regex in config.def) {
                const pattern = new RegExp(regex, 'i'),
                    responses = config.def[regex],
                    result = pattern.exec(input);

                if (result === null) {
                    continue;
                }

                return this.respond(responses, result);
            }

            if (config.def.default !== undefined) {
                return this.respond(config.def.default, [input]);
            }
        }

        return this.respond(defaultResponses, [input]);
    }

    viewText(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }

    viewMarkdown(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }

    viewJson(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }
}

module.exports = DefModule;
