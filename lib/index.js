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

    process(session, options) {
        if (options.input.type === 'command') {
            return this.processCommand(session, options);
        }

        return this.processText(session, options);
    }

    processResponse(responseObject, options) {
        if (responseObject === null) {
            return;
        }

        let responseText = responseObject.response;

        if (responseObject.responseReplace === true) {
            const argv = options.input.text.split(' ');

            for (let replacement in argv) {
                responseText = responseText.replace(new RegExp('\\$' + replacement + '\\*', 'g'), argv.slice(replacement).join(' '))
                    .replace(new RegExp('\\$' + replacement, 'g'), argv[replacement]);
            }
        }

        const formatterMethod = `format${StringUtils.capitalize(options.input.formatter)}`;

        responseObject[formatterMethod](responseText);
    }

    processCommand(session, options) {
        const argvFirst = options.input.argv._[0];

        if (argvFirst === undefined || !this.isCommandExists(argvFirst)) {
            return Promise.reject(`command not found - ${argvFirst}`);
        }

        return this.commands[argvFirst].callback(options.input.argv, session, options)
            .then((responseObject) => { this.processResponse(responseObject, options); })
            .catch((ex) => {
                throw ex;
            });
    }

    processText(session, options) {
        const promises = this.listeners.map((callback) => {
            return callback(options.input.text, session, options)
                .then((responseObject) => { this.processResponse(responseObject, options); })
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

        const newOptions = Object.assign(
            {},
            options,
            { input: input }
        );

        // create session
        const session = this.platform.createSession(newOptions);

        let promise;

        try {
            promise = this.process(session, newOptions);
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
