const CliSession = require('./CliSession.js');

class CliPlatform {
    constructor(apiBone) {
        this.parent = apiBone;
    }

    createSession(options) {
        return new CliSession(options);
    }

    validateInput(input) {
        let newInput = Object.assign({}, input);

        if (newInput.type === 'text') {
            if (newInput.text[0] === '/') {
                newInput.type = 'command';
                newInput.text = newInput.text.substr(1);
            }
        }

        return newInput;
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

            const input = {
                type: 'text',
                text: reply,
                direct: true
            };

            this.parent.execute({
                input: input
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
