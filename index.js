const path = require('path'),
    fs = require('fs'),
    yargsParser = require('yargs-parser'),
    StringUtils = require('./utils/StringUtils.js');

class ApiBone {
    constructor(platform) {
        this.platform = platform;
    }

    execute(options) {
        const argv = yargsParser(options.args),
            cmd = argv._.shift();

        const moduleType = require(`./modules/${cmd}/`),
            moduleInstance = new moduleType();

        const formatter = argv.format || this.platform.defaultFormatter,
            method = `view${StringUtils.capitalize(formatter)}`;

        if (argv.format !== undefined) {
            delete argv.format;
        }

        if (moduleInstance[method] === undefined) {
            throw new Error(`${method} not defined in ${typeof moduleInstance}.`);
        }

        const session = this.platform.createSession(formatter, options);

        return moduleInstance[method](argv, session)
            .then(() => {
                session.end();
            });
    }
}

module.exports = ApiBone;
