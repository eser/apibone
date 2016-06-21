class ModulesModule {
    constructor(apiBone) {
        this.parent = apiBone;
    }

    execute(argv) {
        return Promise.resolve(this.parent.modules);
    }

    viewText(argv, session) {
        return this.execute(argv)
            .then((modules) => {
                for (let module of modules) {
                    session.log(module);
                }
            });
    }

    viewMarkdown(argv, session) {
        return this.execute(argv)
            .then((modules) => {
                for (let module of modules) {
                    session.log(module);
                }
            });
    }

    viewJson(argv, session) {
        return this.execute(argv)
            .then((modules) => {
                session.log(modules);
            });
    }
}

module.exports = ModulesModule;
