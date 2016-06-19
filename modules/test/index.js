class TestModule {
    execute(argv) {
        return Promise.resolve(argv);
    }

    viewText(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(`Parameters:\n${JSON.stringify(result)}`);
            });
    }

    viewPlaintext(argv, session) {
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
