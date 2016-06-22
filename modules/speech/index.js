const https = require('https'),
    stream = require('stream'),
    config = require('../../config.js');

function speechCommand(argv, session) {
    return new Promise((resolve, reject) => {
        const input = encodeURIComponent(argv._.join(' ')),
            lang = argv.lang || 'tr';

        const streamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&client=tw-ob&q=${input}&tl=${lang}`;

        const spt = new stream.PassThrough();

        https.get(streamUrl, (res) => {
            res.pipe(spt);

            resolve({
                response: {
                    filename: `${input}.mp3`,
                    contentType: 'audio/mpeg',
                    stream: spt
                },
                formatText: (result) => { session.voice(result.filename, result.contentType, result.stream); },
                formatMarkdown: (result) => { session.voice(result.filename, result.contentType, result.stream); },
                formatJson: (result) => { session.voice(result.filename, result.contentType, result.stream); }
            });
        });
    });
}

apiBone.addCommand({
    command: 'speech',
    description: 'Text-to-speech',
    usage: 'speech free speech',
    demandArgs: 1,
    demandOptions: [ ],
    callback: speechCommand
});
