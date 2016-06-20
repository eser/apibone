# apibone

A tiny backbone that provides platform-agnostic environment for its modules.

apibone is initially designed for query various web services and return responses in requested format. Whether the platform is cli or web, it provides the same interface for input and output for modules.

An apibone query consists of 3 parts:

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
$ apibone salyangoz --limit 2
$ apibone salyangoz --limit 2 --format json
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
http://localhost:3000/salyangoz?limit=2
http://localhost:3000/rates/usd/try?amount=5
http://localhost:3000/weather/izmir
http://localhost:3000/test/anyCommand?anyParam=anyValue&anyOptionalParam&format=text
```

### Modules

- Salyangoz (http://salyangoz.me)
- Rates
- Weather (http://openweathermap.org)
- Def
