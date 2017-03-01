const path = require('path'),
    fs = require('fs'),
    yargsParser = require('yargs-parser'),
    StringUtils = require('./utils/StringUtils.js'),
    config = require('../config.js');

class ApiBone {
    constructor(platformType) {
        this.platform = new platformType(this);

        this.commands = {};
        this.loadCommands();
        this.defaultCommand = config.defaultCommand;

        this.aliases = {};
        this.loadAliases();
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

    loadCommands() {
        const dir = path.join(__dirname, 'modules'),
            files = fs.readdirSync(dir);

        global.apiBone = this;
        for (let file of files) {
            require(`./modules/${file}`);
        }
    }

    /*
    apiBone.addAlias('define', 'def');
    */
    addAlias(alias, command) {
        this.aliases[alias] = command;
    }

    loadAliases() {
        if (config.aliases === undefined) {
            return;
        }

        for (let alias in config.aliases) {
            this.addAlias(alias, config.aliases[alias]);
        }
    }

    stripCmd0(cmd0) {
        const startPos = (cmd0[0] == '/') ? 1 : 0,
            atPos = cmd0.indexOf('@');

        if (atPos > 0) {
            return cmd0.substr(startPos, atPos - startPos);
        }

        return cmd0.substr(startPos);
    }

    parseArgv(args) {
        const argv = yargsParser(args); // .replace('  ', ' ')

        if (argv._.length > 0) {
            argv._[0] = this.stripCmd0(argv._[0]);
        }

        let joined = argv._.join(' ');

        for (let alias in this.aliases) {
            const aliasLength = alias.length;

            if (joined.substr(0, aliasLength) === alias) {
                joined = this.aliases[alias] + joined.substr(aliasLength);
            }
        }

        for (let command in this.commands) {
            const commandLength = command.length;

            if (joined.substr(0, commandLength) === command) {
                argv.command = this.commands[command];
                joined = joined.substr(commandLength).trim();
            }
        }

        if (argv.command === undefined && this.defaultCommand !== undefined) {
            argv.command = this.commands[this.defaultCommand];
            joined = joined.trim();
        }

        argv._ = (joined.length > 0) ? joined.split(' ') : [];

        return argv;
    }

    execute(options) {
        const argv = this.parseArgv(options.args);

        // determine default formatter
        const formatter = argv.format || this.platform.defaultFormatter,
            formatterMethod = `format${StringUtils.capitalize(formatter)}`;

        if (argv.format !== undefined) {
            delete argv.format;
        }

        // create session
        const session = this.platform.createSession(formatter, options);

        try {
            // check command
            if (argv.command === undefined) {
                if (argv._.length === 0) {
                    return Promise.resolve();
                }

                throw new Error('command not found');
            }

            // check demands
            if (argv._.length < argv.command.demandArgs) {
                throw new Error(`command usage: ${argv.command.usage}`);
            }

            return argv.command.callback(argv, session)
                .then((responseObject) => {
                    let responseText = responseObject.response;

                    if (responseObject.responseReplace === true) {
                        for (let replacement in argv._) {
                            responseText = responseText.replace(new RegExp('\\$' + replacement + '\\*', 'g'), argv._.slice(replacement).join(' '))
                                .replace(new RegExp('\\$' + replacement, 'g'), argv._[replacement]);
                        }
                    }

                    responseObject[formatterMethod](responseText);
                    session.end();
                })
                .catch((ex) => {
                    throw ex;
                });
        }
        catch (ex) {
            session.error(ex);
            session.end();

            // FIXME: don't pass thrown exception below
            return Promise.resolve();
        }
    }
}

module.exports = ApiBone;
