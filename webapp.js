const express = require('express'),
    WebPlatform = require('./platforms/web/WebPlatform.js'),
    ApiBone = require('./'),
    app = express();

const platform = new WebPlatform(),
    apiBone = new ApiBone(platform);

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

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
