const SlackPlatform = require('./platforms/slack/SlackPlatform.js'),
    ApiBone = require('./');

const apiBone = new ApiBone(SlackPlatform);

console.log('Started!');
