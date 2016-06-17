const yargsParser = require('yargs-parser');

class ApiBone {
    constructor() {
    }

    setFormatter(formatter) {
        this.formatter = formatter;
    }

    run(args) {
        const argv = yargsParser(args);

        const cmd = argv._.shift();

        const moduleType = require(`./modules/${cmd}/`),
            moduleInstance = new moduleType();

        moduleInstance.run(argv, this.formatter);
        this.formatter.end();
    }
}

const apiBone = new ApiBone();

module.exports = apiBone;
