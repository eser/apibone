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
        formatPlain: (result) => {
            for (let command of result) {
                session.sendText(`${command.command}: ${command.description}`);
            }
        },
        formatMarkdown: (result) => {
            for (let command of result) {
                session.sendText(`*${command.command}*: ${command.description} - \`${command.usage}\``);
            }
        },
        formatJson: (result) => { session.sendText(result); }
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
