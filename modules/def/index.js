const NumberUtils = require('../../utils/NumberUtils.js'),
    config = require('../../config.js');

class DefModule {
    execute(argv) {
        const input = argv._.join(' ');

        for (let regex in config.def) {
            const pattern = new RegExp(regex, 'i'),
                responses = config.def[regex],
                result = pattern.exec(input);

            let response = responses[NumberUtils.getRandomInt(0, responses.length - 1)];

            for (let i = 0, length = result.length; i < length; i++) {
                response = response.replace(new RegExp('\\$' + i, 'g'), result[i]);
            }

            return Promise.resolve(response);
        }

        return Promise.resolve(config.def.default);
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
