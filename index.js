const path = require('path'),
    fs = require('fs'),
    yargsParser = require('yargs-parser'),
    StringUtils = require('./utils/StringUtils.js');

class ApiBone {
    constructor(platform) {
        this.platform = platform;
    }

    repl() {
        const readline = require('readline');

        const readlineInstance = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readlineInstance.setPrompt('apibone> ');
        readlineInstance.prompt();

        readlineInstance.on('line', (reply) => {
            reply = reply.trim();

            if (reply === '/q' || reply === '/quit') {
                readlineInstance.close();
                return;
            }

            this.execute({ args: reply })
                .then(() => {
                    readlineInstance.prompt();
                });
        });
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

        const session = this.platform.createSession(formatter, options);

        try {
            if (moduleInstance[method] === undefined) {
                throw new Error(`${method} not defined in ${typeof moduleInstance}.`);
            }

            return moduleInstance[method](argv, session)
                .then(() => {
                    session.end();
                })
                .catch((ex) => {
                    session.error(ex);
                });
        }
        catch (ex) {
            session.error(ex);
        }
    }
}

module.exports = ApiBone;
