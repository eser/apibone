class TestModule {
    constructor(apiBone) {
        this.parent = apiBone;
    }

    execute(argv) {
        return Promise.resolve(argv);
    }

    viewText(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(`Parameters:\n${JSON.stringify(result)}`);
            });
    }

    viewMarkdown(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(`Parameters:\n${JSON.stringify(result)}`);
            });
    }

    viewJson(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }
}

module.exports = TestModule;
