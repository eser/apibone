const github = require('github'),
    config = require('../../../config.js');

const githubApi = new github();

function gistCommand(argv, session) {
    const gistContent = githubApi.gists.get({
        id: argv._[1]
    });

    return Promise.resolve({
        response: gistContent,
        formatPlain: (result) => { session.sendText(result); },
        formatMarkdown: (result) => { session.sendText(result); },
        formatJson: (result) => { session.sendText(result); }
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
