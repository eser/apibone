const CliSession = require('./CliSession.js');

class CliPlatform {
    constructor(apiBone) {
        this.parent = apiBone;
        this.defaultFormatter = 'text';
    }

    createSession(options, formatter) {
        return new CliSession(options, formatter);
    }

    repl() {
        const readline = require('readline');

        const quitCommands = [ '/q', '\\q', '/quit' ];

        const readlineInstance = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readlineInstance.setPrompt('apibone> ');
        readlineInstance.prompt();

        readlineInstance.on('line', (reply) => {
            reply = reply.trim();

            if (quitCommands.indexOf(reply) !== -1) {
                readlineInstance.close();
                return;
            }

            this.parent.execute({
                args: reply,
                forceResponse: true
            })
                .then(() => {
                    readlineInstance.prompt();
                })
                .catch((ex) => {
                    console.error(ex);
                    readlineInstance.prompt();
                });
        });
    }
}

module.exports = CliPlatform;
