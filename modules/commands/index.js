function commandsCommand(argv, session) {
    return Promise.resolve({
        response: apiBone.commands,
        formatText: (result) => {
            for (let command of result) {
                session.log(command);
            }
        },
        formatMarkdown: (result) => {
            for (let command of result) {
                session.log(command);
            }
        },
        formatJson: (result) => { session.log(result); }
    });
}

apiBone.addCommand({
    command: 'commands',
    description: 'List of commands',
    demandArgs: 0,
    demandOptions: [ ],
    callback: commandsCommand
});
