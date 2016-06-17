const yargsParser = require('yargs-parser');

class ApiBone {
    run(args) {
        const argv = yargsParser(args);

        const cmd = argv._.shift();

        const moduleType = require(`./modules/${cmd}/`),
            moduleInstance = new moduleType();

        moduleInstance.run(argv);
    }
}

const apiBone = new ApiBone();

module.exports = apiBone;
