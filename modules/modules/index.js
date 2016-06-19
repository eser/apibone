const path = require('path'),
    fs = require('fs');

class ModulesModule {
    execute(argv) {
        const dir = path.join(__dirname, '..'),
            files = fs.readdirSync(dir);

        return Promise.resolve(files);
    }

    viewText(argv, session) {
        return this.execute(argv)
            .then((files) => {
                for (let file of files) {
                    session.log(file);
                }
            });
    }

    viewPlaintext(argv, session) {
        return this.execute(argv)
            .then((files) => {
                for (let file of files) {
                    session.log(file);
                }
            });
    }

    viewJson(argv, session) {
        return this.execute(argv)
            .then((files) => {
                session.log(files);
            });
    }
}

module.exports = ModulesModule;
