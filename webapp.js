const express = require('express'),
    favicon = require('express-favicon'),
    WebPlatform = require('./platforms/web/WebPlatform.js'),
    ApiBone = require('./'),
    app = express();

const platform = new WebPlatform(),
    apiBone = new ApiBone(platform);

app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/*', (req, res) => {
    let args = req.params[0].replace('/', ' ');

    for (let qsKey in req.query) {
        args += ` --${qsKey}=${req.query[qsKey]}`;
    }

    apiBone.execute({
        request: req,
        response: res,
        args: args
    });
});

const port = parseInt(process.env.PORT || '3000');
app.set('port', port);

app.listen(port, function () {
    console.log(`apibone server is listening on port ${port}!`);
});
