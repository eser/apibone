const path = require('path'),
    fs = require('fs'),
    yargsParser = require('yargs-parser'),
    StringUtils = require('./utils/StringUtils.js'),
    config = require('./config.js');

class ApiBone {
    constructor(platformType) {
        this.platform = new platformType(this);

        this.aliases = {};
        this.assignModules();
    }

    assignModules() {
        const dir = path.join(__dirname, 'modules'),
            files = fs.readdirSync(dir);

        this.modules = {};

        for (let file of files) {
            this.modules[file] = file;
        }
    }

    stripCmd(cmd0) {
        const startPos = (cmd0[0] == '/') ? 1 : 0,
            atPos = cmd0.indexOf('@');

        if (atPos > 0) {
            return cmd0.substr(startPos, atPos - startPos);
        }

        return cmd0.substr(startPos);
    }

    parseArgv(args) {
        const argv = yargsParser(args);

        if (argv._.length > 0) {
            argv._[0] = this.stripCmd(argv._[0]);
        }

        if (config.aliases !== undefined) {
            let joined = argv._.join(' ');

            for (let alias in config.aliases) {
                const aliasLength = alias.length;

                if (joined.substr(0, aliasLength) === alias) {
                    joined = config.aliases[alias] + joined.substr(aliasLength);
                }
            }

            argv._ = (joined.length > 0) ? joined.split(' ') : [];
        }

        return argv;
    }

    initModule(moduleName) {
        const module = this.modules[moduleName];

        if (module === undefined) {
            throw new Error(`${moduleName} is not a registered module.`);
        }

        const moduleType = require(`./modules/${module}/`),
            moduleInstance = new moduleType(this);

        return moduleInstance;
    }

    execute(options) {
        const argv = this.parseArgv(options.args),
            cmd0 = argv._.shift();

        if (cmd0 === undefined || cmd0.trim().length === 0) {
            return Promise.resolve();
        }

        const moduleInstance = this.initModule(cmd0);

        const formatter = argv.format || this.platform.defaultFormatter,
            method = `view${StringUtils.capitalize(formatter)}`;

        if (argv.format !== undefined) {
            delete argv.format;
        }

        const session = this.platform.createSession(formatter, options);

        try {
            if (moduleInstance[method] === undefined) {
                throw new Error(`${method} is not defined in ${cmd0} module.`);
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
