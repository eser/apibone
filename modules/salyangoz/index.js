const fetch = require('node-fetch'),
    colors = require('colors'),
    emoji = require('node-emoji');

class SalyangozModule {
    run(argv, formatter) {
        fetch('https://salyangoz.me/recent.json')
            .then((res) => res.json())
            .then((json) => {
                let count = 0;

                for(let post of json.posts) {
                    if (argv.limit !== undefined && count++ >= argv.limit) {
                        break;
                    }

                    const username = `${emoji.get(':bust_in_silhouette:')} ${post.user.user_name}`,
                        time     = `${emoji.get(':clock1:')} ${post.updated_at} ago`,
                        views    = `${emoji.get(':dart:')}  ${post.visit_count} views`;

                    formatter.log(colors.grey.bold(post.title));
                    formatter.log(colors.cyan.underline(post.url));
                    formatter.log(`${username}  ${time} ${views}\n`);
                }
            });
    }
}

module.exports = SalyangozModule;
