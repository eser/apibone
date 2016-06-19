const fetch = require('node-fetch');

class SalyangozModule {
    execute(argv) {
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

                return Promise.resolve(doc);
            });
    }

    viewText(argv, session) {
        const colors = require('colors'),
            emoji = require('node-emoji');

        return this.execute(argv)
            .then((posts) => {
                for (let post of posts) {
                    const username = `${emoji.get(':bust_in_silhouette:')} ${post.username}`,
                        time = `${emoji.get(':clock1:')} ${post.time} ago`,
                        views = `${emoji.get(':dart:')}  ${post.views} views`;

                    session.log(`${colors.grey.bold(post.title)}\n${colors.cyan.underline(post.url)}\n${username}  ${time} ${views}`);
                }
            });
    }

    viewMarkdown(argv, session) {
        const emoji = require('node-emoji');

        return this.execute(argv)
            .then((posts) => {
                for (let post of posts) {
                    const username = `${emoji.get(':bust_in_silhouette:')} ${post.username}`,
                        time = `${emoji.get(':clock1:')} ${post.time} ago`,
                        views = `${emoji.get(':dart:')}  ${post.views} views`;

                    session.log(`${post.title}\n${post.url}\n${username}  ${time} ${views}`);
                }
            });
    }

    viewJson(argv, session) {
        return this.execute(argv)
            .then((posts) => {
                session.log(posts);
            });
    }
}

module.exports = SalyangozModule;
