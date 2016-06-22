const fetch = require('node-fetch'),
    colors = require('colors'),
    config = require('../../config.js');

function weatherCommand(argv, session) {
    const city = argv._[0],
        unit = argv.metric || 'metric',
        apiKey = config.openweathermap.apiKey;

    return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)
        .then((res) => res.json())
        .then((json) => {
            return Promise.resolve({
                response: {
                    city: json.name,
                    temperature: json.main.temp_min,
                    temperatureMax: json.main.temp_max,
                    brief: json.weather[0].main,
                    detail: json.weather[0].description
                },
                formatText: (result) => {
                    const cityStr = `${result.city}`,
                    detailStr = `${result.brief} (${result.detail})`;

                    let tempStr = `${result.temperature}°C`;

                    if (result.temperature !== result.temperatureMax) {
                        tempStr += `-${result.temperatureMax}°C`;
                    }

                    session.log(`${colors.yellow.bold(cityStr)} ${colors.green.bold(tempStr)} ${detailStr}`);
                },
                formatMarkdown: (result) => {
                    const cityStr = `${result.city}`,
                        detailStr = `${result.brief} (${result.detail})`;

                    let tempStr = `${result.temperature}°C`;

                    if (result.temperature !== result.temperatureMax) {
                        tempStr += `-${result.temperatureMax}°C`;
                    }

                    session.log(`*${cityStr}* ${tempStr} ${detailStr}`);
                },
                formatJson: (result) => {
                    session.log(result);
                }
            });
        });
}

apiBone.addCommand({
    command: 'weather',
    description: 'Queries weather in a region',
    usage: 'weather izmir',
    demandArgs: 1,
    demandOptions: [ ],
    callback: weatherCommand
});
