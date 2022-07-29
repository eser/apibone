# apibone

[![npm version][npm-image]][npm-url]
[![npm download][download-image]][npm-url]
[![dependencies][dep-image]][dep-url]
[![license][license-image]][license-url]


## Update (July 2022)

DEPRECATED in favor of [hex](https://github.com/eserozvataf/hex).
See https://github.com/eserozvataf/hex for details.


## README

[apibone](https://github.com/eserozvataf/apibone) is a library which provides some interfaces for queryable services. It simply abstracts request and response objects for its defined functions.

apibone modules query various web services and return responses in requested formatting. Whether the platform is cli or web, modules access same interface for input and output objects.


## Queries

Apibone breaks queries in three parts:

- Module name / alias
- Arguments
- Parameters

in command line form:

```sh
module [arguments ...] [--parameter value ...]
```

For example, to execute rates module in order to query 5 USD's TRY value:

```sh
$ apibone module rates usd try --amount 5 # cli example
http://example.com/rates/usd/try?amount=5 # web example
```

**module:** module name which will be called. (e.g.: **rates**)   
**arguments:** arguments of operation (e.g.: first argument is **usd**, second argument is **try**)   
**parameters:** optional settings for operation (e.g.: **amount** with value **5**)


### Installation
```sh
$ npm install -g apibone
$ mv config.sample.js config.js # rename config.sample.js to config.js
```


### CLI Usage
```sh
$ apibone module [arguments]

# Examples:
$ apibone modules
$ apibone rates usd try
$ apibone rates usd try --amount 5
$ apibone weather izmir
$ apibone test anyCommand --anyParam=anyValue --anyOptionalParam
```


### REPL Usage
```sh
$ apibone

apibone> modules
apibone> weather izmir
apibone> /q
```


### Web Usage
```sh
$ npm start

# Example:
http://localhost:3000/modules
http://localhost:3000/rates/usd/try?amount=5
http://localhost:3000/weather/izmir
http://localhost:3000/test/anyCommand?anyParam=anyValue&anyOptionalParam&format=text
```


### Start as a Telegram Bot
```sh
$ node ./lib/telegrambot.js
```


### Start as a Slack Bot
```sh
$ node ./lib/slackbot.js
```


### Modules

- Salyangoz (http://salyangoz.me)
- Rates
- Weather (http://openweathermap.org)
- Def
- Speech (https://translate.google.com/)


### Requirements

* node.js (https://nodejs.org/)


## License

MIT, for further details, please see [LICENSE](LICENSE) file.


## Contributing

See [contributors.md](contributors.md)

It is publicly open for any contribution. Bugfixes, new features and extra modules are welcome.

* To contribute to code: Fork the repo, push your changes to your fork, and submit a pull request.
* To report a bug: If something does not work, please report it using [GitHub Issues](https://github.com/eserozvataf/apibone/issues).


## To Support

[Visit my patreon profile at patreon.com/eserozvataf](https://www.patreon.com/eserozvataf)



[npm-image]: https://img.shields.io/npm/v/apibone.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/apibone
[download-image]: https://img.shields.io/npm/dt/apibone.svg?style=flat-square
[dep-image]: https://img.shields.io/david/eserozvataf/apibone.svg?style=flat-square
[dep-url]: https://github.com/eserozvataf/apibone
[license-image]: https://img.shields.io/npm/l/apibone.svg?style=flat-square
[license-url]: https://github.com/eserozvataf/apibone/blob/master/LICENSE
