const path = require('path'),
    fs = require('fs'),
    yargsParser = require('yargs-parser'),
    StringUtils = require('./utils/StringUtils');

class ApiBone {
    constructor(platformType) {
        this.platform = new platformType(this);

        this.listeners = [];
        this.commands = {};
        this.aliases = {};

        this.loadModules();
        this.loadConfig();
    }

    loadModules() {
        const dir = path.join(__dirname, 'modules'),
            files = fs.readdirSync(dir);

        global.apiBone = this;
        for (let file of files) {
            require(`./modules/${file}`);
        }
    }

    loadConfig() {
        const config = require('../config.js');

        if (config.aliases !== undefined) {
            for (let alias in config.aliases) {
                this.addAlias(alias, config.aliases[alias]);
            }
        }
    }

    /*
    apiBone.addListener(callback);
    */
    addListener(callback) {
        this.listeners.push(callback);
    }

    /*
    apiBone.addCommand({
        command: 'def',
        description: 'Defines things',
        demandArgs: 1,
        demandOptions: [ 'format' ],
        callback: null
    });
    */
    addCommand(commandDefinition) {
        this.commands[commandDefinition.command] = commandDefinition;
    }

    isCommandExists(command) {
        return command in this.commands;
    }

    /*
    apiBone.addAlias('define', 'def');
    */
    addAlias(alias, command) {
        this.aliases[alias] = command;
    }

    parseArgv(args) {
        const argv = yargsParser(args);

        return argv;
    }

    process(session, input) {
        if (input.type === 'command') {
            return this.processCommand(session, input);
        }

        return this.processText(session, input);
    }

    processResponse(responseObject, input) {
        if (responseObject === null) {
            return;
        }

        let responseText = responseObject.response;

        if (responseObject.responseReplace === true) {
            const argv = input.text.split(' ');

            for (let replacement in argv) {
                responseText = responseText.replace(new RegExp('\\$' + replacement + '\\*', 'g'), argv.slice(replacement).join(' '))
                    .replace(new RegExp('\\$' + replacement, 'g'), argv[replacement]);
            }
        }

        const formatterMethod = `format${StringUtils.capitalize(input.formatter)}`;

        responseObject[formatterMethod](responseText);
    }

    processCommand(session, input) {
        const argvFirst = input.argv._[0];

        if (argvFirst === undefined || !this.isCommandExists(argvFirst)) {
            return Promise.reject(`command not found - ${argvFirst}`);
        }

        return this.commands[argvFirst].callback(input.argv, session)
            .then((responseObject) => { this.processResponse(responseObject, input); })
            .catch((ex) => {
                throw ex;
            });
    }

    processText(session, input) {
        const promises = this.listeners.map((callback) => {
            return callback(input.text, session)
                .then((responseObject) => { this.processResponse(responseObject, input); })
                .catch((ex) => {
                    throw ex;
                });
        });

        return Promise.all(promises);
    }

    execute(options) {
        const input = Object.assign(
            { formatter: 'plain' },
            this.platform.validateInput(options.input)
        );

        if (input.type === 'command') {
            input.argv = this.parseArgv(input.text);
        }

        // create session
        const session = this.platform.createSession(options);

        let promise;

        try {
            promise = this.process(session, input);
        }
        catch (ex) {
            promise = session.error(ex);
        }

        promise.then(() => {
            session.end();
        });

        return promise;
    }
}

module.exports = ApiBone;
