function commandsCommand(argv, session) {
    return Promise.resolve({
        response: Object.keys(apiBone.commands).map((item) => {
            const command = apiBone.commands[item];

            return {
                command: command.command,
                description: command.description,
                usage: command.usage
            };
        }),
        formatText: (result) => {
            for (let command of result) {
                session.log(`${command.command}: ${command.description}`);
            }
        },
        formatMarkdown: (result) => {
            for (let command of result) {
                session.log(`*${command.command}*: ${command.description}`);
            }
        },
        formatJson: (result) => { session.log(result); }
    });
}

apiBone.addCommand({
    command: 'commands',
    description: 'List of commands',
    usage: 'commands',
    demandArgs: 0,
    demandOptions: [ ],
    callback: commandsCommand
});
