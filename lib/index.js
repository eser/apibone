const path = require('path'),
    fs = require('fs'),
    yargsParser = require('yargs-parser'),
    haller = require('haller'),
    StringUtils = require('./utils/StringUtils.js'),
    NumberUtils = require('./utils/NumberUtils.js'),
    config = require('../config.js');

class ApiBone {
    constructor(platformType) {
        this.platform = new platformType(this);

        this.listeners = [];
        this.commands = {};

        this.loadModules();
    }

    loadModules() {
        const dir = path.join(__dirname, 'modules'),
            files = fs.readdirSync(dir);

        global.apiBone = this;
        for (let file of files) {
            require(`./modules/${file}`);
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

    processVariable(variable, argv) {
        if (variable === 'args') {
            return argv.slice(1).join(' ');
        }

        for (let replacement in argv) {
            if (variable === replacement) {
                return argv[replacement];
            }

            if (variable === replacement + '*') {
                return argv.slice(replacement).join(' ');
            }
        }

        if (config.randoms !== undefined && config.randoms[variable] !== undefined) {
            const items = config.randoms[variable],
                pick = NumberUtils.getRandomInt(0, items.length - 1);

            return items[pick];
        }
    }

    processVariableFilters(text, filters) {
        let input = text;

        for (let filter of filters) {
            if (filter === 'upper') {
                input = input.toUpperCase();
                continue;
            }

            if (filter === 'lower') {
                input = input.toLowerCase();
                continue;
            }

            if (filter === 'hal-e') {
                input = haller(input, 'e');
                continue;
            }

            if (filter === 'hal-i') {
                input = haller(input, 'i');
                continue;
            }

            if (filter === 'hal-de') {
                input = haller(input, 'de');
                continue;
            }

            if (filter === 'hal-den') {
                input = haller(input, 'den');
                continue;
            }
        }

        return input;
    }

    processResponse(responseObject, options) {
        if (responseObject === null) {
            return;
        }

        let responseText;

        if (Array.isArray(responseObject.response)) {
            const argvP = Number(options.input.argv.p) - 1;

            if (argvP !== undefined && argvP in responseObject.response) {
                responseText = responseObject.response[argvP];
            }
            else {
                const responseId = NumberUtils.getRandomInt(0, responseObject.response.length - 1);

                responseText = responseObject.response[responseId];
            }
        }
        else {
            responseText = responseObject.response;
        }

        if (responseObject.responseReplace === true) {
            const argv = options.input.argv._;

            responseText = responseText.replace(
                /\{[^}]*\}/g,
                (match) => {
                    const matchText = match.substr(1, match.length - 2),
                        parts = matchText.split(':');

                    let processed = this.processVariable(parts[0], argv);

                    if (parts.length > 1) {
                        processed = this.processVariableFilters(processed, parts.slice(1));
                    }

                    return processed;
                }
            );
        }

        const formatterMethod = `format${StringUtils.capitalize(options.input.formatter)}`;

        responseObject[formatterMethod](responseText);
    }

    processCommand(session, options) {
        const argv = options.input.argv._,
            argvFirst = argv[0];

        if (argvFirst === undefined || !this.isCommandExists(argvFirst)) {
            return Promise.reject(`command not found - ${argvFirst}`);
        }

        if (this.commands[argvFirst].demandArgs !== undefined) {
            if (argv.length <= this.commands[argvFirst].demandArgs) {
                return Promise.reject(`insufficient parameters for ${argvFirst}`);
            }
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
