const fetch = require('node-fetch'),
    colors = require('colors'),
    emoji = require('node-emoji');

function salyangozCommand(argv, session) {
    return fetch('https://salyangoz.me/recent.json')
        .then((res) => res.json())
        .then((json) => {
            const doc = [];

            let count = 0;

            for (let post of json.posts) {
                if (argv.limit !== undefined && count++ >= argv.limit) {
                    break;
                }

                doc.push({
                    title: post.title,
                    url: post.url,
                    username: post.user.user_name,
                    time: post.updated_at,
                    views: post.visit_count
                });
            }

            return Promise.resolve({
                response: doc,
                formatText: (posts) => {
                    for (let post of posts) {
                        const username = `${emoji.get(':bust_in_silhouette:')} ${post.username}`,
                            time = `${emoji.get(':clock1:')} ${post.time} ago`,
                            views = `${emoji.get(':dart:')}  ${post.views} views`;

                        session.log(`${colors.grey.bold(post.title)}\n${colors.cyan.underline(post.url)}\n${username}  ${time} ${views}`);
                    }
                },
                formatMarkdown: (posts) => {
                    for (let post of posts) {
                        const username = `${emoji.get(':bust_in_silhouette:')} ${post.username}`,
                            time = `${emoji.get(':clock1:')} ${post.time} ago`,
                            views = `${emoji.get(':dart:')}  ${post.views} views`;

                        session.log(`${post.title}\n${post.url}\n${username}  ${time} ${views}`);
                    }
                },
                formatJson: (posts) => {
                    session.log(posts);
                }
            });
        });
}

apiBone.addCommand({
    command: 'salyangoz',
    description: 'Gets salyangoz.me feed',
    usage: 'salyangoz [--limit 5]',
    demandArgs: 0,
    demandOptions: [ ],
    callback: salyangozCommand
});
