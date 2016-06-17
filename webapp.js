const express = require('express'),
    webFormatter = require('./formatters/WebFormatter.js'),
    apibone = require('./'),
    app = express();

app.get('/*', (req, res) => {
    let args = req.params[0].replace('/', ' ');

    for (let qsKey in req.query) {
        args += ` --${qsKey}=${req.query[qsKey]}`;
    }

    apibone.setFormatter(new webFormatter(res));
    apibone.run(args);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
