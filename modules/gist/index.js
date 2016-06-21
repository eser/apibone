const github = require('github'),
    config = require('../../config.js');

class GistModule {
    constructor(apiBone) {
        this.parent = apiBone;

        this.githubApi = new github();
    }

    execute(argv) {
        if (argv._.length < 1) {
            return Promise.reject(new Error(`needs a gist id`));
        }

        const gistContent = this.githubApi.gists.get({
            id: argv._[0]
        });

        return Promise.resolve(gistContent);
    }

    viewText(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }

    viewMarkdown(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }

    viewJson(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }
}

module.exports = GistModule;
