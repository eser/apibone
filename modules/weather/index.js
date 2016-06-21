const fetch = require('node-fetch'),
    config = require('../../config.js');

class WeatherModule {
    constructor(apiBone) {
        this.parent = apiBone;
    }

    execute(argv) {
        if (argv._.length < 1) {
            return Promise.reject(new Error(`needs a city to query, e.g.: izmir`));
        }

        const city = argv._[0],
            unit = argv.metric || 'metric',
            apiKey = config.openweathermap.apiKey;

        return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`)
            .then((res) => res.json())
            .then((json) => {
                return Promise.resolve({
                    city: json.name,
                    temperature: json.main.temp_min,
                    temperatureMax: json.main.temp_max,
                    brief: json.weather[0].main,
                    detail: json.weather[0].description
                });
            });
    }

    viewText(argv, session) {
        const colors = require('colors');

        return this.execute(argv)
            .then((result) => {
                const cityStr = `${result.city}`,
                    detailStr = `${result.brief} (${result.detail})`;

                let tempStr = `${result.temperature}°C`;

                if (result.temperature !== result.temperatureMax) {
                    tempStr += `-${result.temperatureMax}°C`;
                }

                session.log(`${colors.yellow.bold(cityStr)} ${colors.green.bold(tempStr)} ${detailStr}`);
            });
    }

    viewMarkdown(argv, session) {
        return this.execute(argv)
            .then((result) => {
                const cityStr = `${result.city}`,
                    detailStr = `${result.brief} (${result.detail})`;

                let tempStr = `${result.temperature}°C`;

                if (result.temperature !== result.temperatureMax) {
                    tempStr += `-${result.temperatureMax}°C`;
                }

                session.log(`*${cityStr}* ${tempStr} ${detailStr}`);
            });
    }

    viewJson(argv, session) {
        return this.execute(argv)
            .then((result) => {
                session.log(result);
            });
    }
}

module.exports = WeatherModule;
