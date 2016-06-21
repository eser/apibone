const fetch = require('node-fetch');

class RatesModule {
    constructor(apiBone) {
        this.parent = apiBone;
    }

    execute(argv) {
        if (argv._.length < 2) {
            return Promise.reject(new Error(`needs two currencies to convert, e.g.: usd try`));
        }

        const from = argv._[0].toUpperCase(),
            to = argv._[1].toUpperCase(),
            amount = argv.amount || 1;

        return fetch(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22${from}${to}%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=`)
            .then((res) => res.json())
            .then((json) => {
                const rate = json.query.results.rate.Rate;

                if (rate === 'N/A') {
                    return Promise.reject(new Error(`unknown currency conversion - ${from} => ${to}`));
                }

                return Promise.resolve({
                    from: from,
                    to: to,
                    amount: amount,
                    rate: (amount * rate).toFixed(2)
                });
            });
    }

    viewText(argv, session) {
        const colors = require('colors');

        return this.execute(argv)
            .then((result) => {
                const fromStr = `${result.amount} ${result.from}`,
                    toStr = `${result.rate} ${result.to}`;

                session.log(`${colors.yellow.bold(fromStr)} => ${colors.green.bold(toStr)}`);
            });
    }

    viewMarkdown(argv, session) {
        return this.execute(argv)
            .then((result) => {
                const fromStr = `${result.amount} ${result.from}`,
                    toStr = `${result.rate} ${result.to}`;

                session.log(`*${fromStr}* => *${toStr}*`);
            });
    }

    viewJson(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }
}

module.exports = RatesModule;
