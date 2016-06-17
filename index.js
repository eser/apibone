const yargsParser = require('yargs-parser'),
    formatter = require('./formatter.js');

class ApiBone {
    constructor() {
        this.formatter = formatter;
    }

    run(args) {
        const argv = yargsParser(args);

        const cmd = argv._.shift();

        const moduleType = require(`./modules/${cmd}/`),
            moduleInstance = new moduleType();

        moduleInstance.run(argv, this.formatter);
    }
}

const apiBone = new ApiBone();

module.exports = apiBone;
