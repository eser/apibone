const config = require('../../../config.js');

const channels = {};

function subCommand(argv, session, options) {
    const channel = argv._[1],
        from = options.message.from;

    if (!(channel in channels)) {
        channels[channel] = [];
    }

    if (channels[channel].filter(x => x.id === from.id).length > 0) {
        throw new Error(`already subscribed to ${channel}`);
    }

    channels[channel].push(from);

    return Promise.resolve({
        response: {
            channel: channel
        },
        formatPlain: (result) => {
            session.sendText(`subscribed to ${result.channel}`);
        },
        formatMarkdown: (result) => {
            session.sendText(`subscribed to ${result.channel}`);
        },
        formatJson: (result) => {
            session.sendText(`subscribed to ${result.channel}`);
        }
    });
}

function unsubCommand(argv, session, options) {
    const channel = argv._[1],
        from = options.message.from;

    let found = false;

    if (channel in channels) {
        for (let i = channels[channel].length - 1; i >= 0; i--) {
            if (channels[channel][i].id === from.id) {
                channels[channel].splice(i, 1);

                found = true;
                break;
            }
        }
    }

    if (!found) {
        throw new Error(`you are not subscribed to ${channel}`);
    }

    return Promise.resolve({
        response: {
            channel: channel
        },
        formatPlain: (result) => {
            session.sendText(`unsubscribed from ${result.channel}`);
        },
        formatMarkdown: (result) => {
            session.sendText(`unsubscribed from ${result.channel}`);
        },
        formatJson: (result) => {
            session.sendText(`unsubscribed from ${result.channel}`);
        }
    });
}

function subsCommand(argv, session, options) {
    const from = options.message.from;

    const names = [];

    for (let channel in channels) {
        for (let i = channels[channel].length - 1; i >= 0; i--) {
            if (channels[channel][i].id === from.id) {
                names.push(channel);
            }
        }
    }

    return Promise.resolve({
        response: {
            channels: names
        },
        formatPlain: (result) => {
            session.sendText(`subscriptions: ${result.channels.join(', ')}`);
        },
        formatMarkdown: (result) => {
            session.sendText(`subscriptions: ${result.channels.join(', ')}`);
        },
        formatJson: (result) => {
            session.sendText(`subscriptions: ${result.channels.join(', ')}`);
        }
    });
}

function pubCommand(argv, session, options) {
    const channel = argv._[1],
        from = options.message.from;

    if (!(channel in channels) || channels[channel].length === 0) {
        throw new Error(`no such channel named ${channel}`);
    }

    for (let i = channels[channel].length - 1; i >= 0; i--) {
        const subscriber = channels[channel][i];

        options.bot.sendMessage({
            chat_id: subscriber.id,
            text: `#${channel} <${from.username}> ${argv._.slice(2).join(' ')}`,
            parse_mode: 'Markdown'
        })
    }

    return Promise.resolve({
        response: {
        },
        formatPlain: (result) => {
        },
        formatMarkdown: (result) => {
        },
        formatJson: (result) => {
        }
    });
}

apiBone.addCommand({
    command: 'sub',
    description: 'Subscribes to a channel',
    usage: 'sub logan',
    demandArgs: 1,
    demandOptions: [ ],
    callback: subCommand
});

apiBone.addCommand({
    command: 'unsub',
    description: 'Unsubscribes from a channel',
    usage: 'unsub logan',
    demandArgs: 1,
    demandOptions: [ ],
    callback: unsubCommand
});

apiBone.addCommand({
    command: 'subs',
    description: 'Lists channel subscriptions',
    usage: 'subs',
    demandArgs: 0,
    demandOptions: [ ],
    callback: subsCommand
});

apiBone.addCommand({
    command: 'pub',
    description: 'Publishes to a channel',
    usage: 'pub logan text',
    demandArgs: 2,
    demandOptions: [ ],
    callback: pubCommand
});
