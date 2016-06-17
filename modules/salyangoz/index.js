const fetch = require('node-fetch'),
    colors = require('colors'),
    emoji = require('node-emoji');

class SalyangozModule {
    run(argv) {
        fetch('https://salyangoz.me/recent.json')
            .then((res) => res.json())
            .then((json) => {
                json.posts.forEach((post, index) => {
                    const username = emoji.get(':bust_in_silhouette:') + ' ' + post.user.user_name;
                    const time     = emoji.get(':clock1:') + ' ' + post.updated_at + ' ago';
                    const views    = emoji.get(':dart:') + '  ' + post.visit_count + ' views';

                    console.log(colors.grey.bold(post.title));
                    console.log(colors.cyan.underline(post.url));
                    console.log(`${username}  ${time} ${views}\n`);
                });
            });
    }
}

module.exports = SalyangozModule;
