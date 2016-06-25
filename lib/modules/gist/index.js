const github = require('github'),
    config = require('../../../config.js');

const githubApi = new github();

function gistCommand(argv, session) {
    const gistContent = githubApi.gists.get({
        id: argv._[0]
    });

    return Promise.resolve({
        response: gistContent,
        formatText: (result) => { session.log(result); },
        formatMarkdown: (result) => { session.log(result); },
        formatJson: (result) => { session.log(result); }
    });
}

apiBone.addCommand({
    command: 'gist',
    description: 'Gets a snippet from gist',
    usage: 'gist gistid',
    demandArgs: 1,
    demandOptions: [ ],
    callback: gistCommand
});
