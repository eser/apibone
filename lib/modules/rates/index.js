const fetch = require('node-fetch'),
    colors = require('colors');

function ratesCommand(argv, session) {
    const from = argv._[1].toUpperCase(),
        to = argv._[2].toUpperCase(),
        amount = argv.amount || 1;

    return fetch(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22${from}${to}%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`)
        .then((res) => res.json())
        .then((json) => {
            const rate = json.query.results.rate.Rate;

            if (rate === 'N/A') {
                return Promise.reject(new Error(`unknown currency conversion - ${from} => ${to}`));
            }

            return Promise.resolve({
                response: {
                    from: from,
                    to: to,
                    amount: amount,
                    rate: (amount * rate).toFixed(2)
                },
                formatPlain: (result) => {
                    const fromStr = `${result.amount} ${result.from}`,
                        toStr = `${result.rate} ${result.to}`;

                    session.sendText(`${colors.yellow.bold(fromStr)} => ${colors.green.bold(toStr)}`);
                },
                formatMarkdown: (result) => {
                    const fromStr = `${result.amount} ${result.from}`,
                        toStr = `${result.rate} ${result.to}`;

                    session.sendText(`*${fromStr}* => *${toStr}*`);
                },
                formatJson: (result) => {
                    session.sendText(result);
                }
            });
        });
}

apiBone.addCommand({
    command: 'rates',
    description: 'Shows parity between currencies',
    usage: 'rates usd try [--amount 1]',
    demandArgs: 2,
    demandOptions: [ ],
    callback: ratesCommand
});

