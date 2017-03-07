const express = require('express'),
    favicon = require('express-favicon'),
    WebPlatform = require('./platforms/web/WebPlatform.js'),
    ApiBone = require('./'),
    app = express();

const apiBone = new ApiBone(WebPlatform);

app.use(favicon(`${__dirname}/../public/favicon.ico`));

app.get('/*', (req, res) => {
    let args = req.params[0].replace(/\//g, ' ');

    for (let qsKey in req.query) {
        args += ` --${qsKey}=${req.query[qsKey]}`;
    }

    apiBone.execute({
        input: {
            type: 'command',
            text: args
        },
        request: req,
        response: res,
        formatter: 'json'
    });
});

const port = parseInt(process.env.PORT || '3000');
app.set('port', port);

app.listen(port, function () {
    console.log(`apibone server is listening on port ${port}!`);
});
