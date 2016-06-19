const TelegramPlatform = require('./platforms/telegram/TelegramPlatform.js'),
    ApiBone = require('./');

const apiBone = new ApiBone(TelegramPlatform);

console.log('Started!');
