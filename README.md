# apibone

A tiny backbone provides platform-agnostic environment for its modules.

apibone is initially designed for query various web services and return responses in requested format. Whether the platform is cli or web, it provides same interface for input and output for modules.

An apibone query consist of 3 parts:

```sh
module [arguments ...] [--parameter value ...]

module rates usd try --amount 5 # cli example
wget http://example.com/rates/usd/try?amount=5 # web example
```

**module:** module name which will be called. (ex: **rates**)   
**arguments:** arguments of operation (ex: first argument is **usd**, second argument is **try**)   
**parameters:** optional settings for operation (ex: **amount** with value **5**)

### Installation
```sh
npm install -g apibone
mv config.sample.js config.js
```

### CLI Usage
```sh
apibone module [arguments]

# Example:
apibone salyangoz --limit 2
apibone salyangoz --limit 2 --format json
apibone rates usd try
apibone rates usd try --amount 5
apibone weather izmir
apibone test anyCommand --anyParam=anyValue --anyOptionalParam
```

### Web Usage
```sh
npm start

# Example:
http://localhost:3000/salyangoz?limit=2
http://localhost:3000/rates/usd/try?amount=5
http://localhost:3000/weather/izmir
http://localhost:3000/test/anyCommand?anyParam=anyValue&anyOptionalParam&format=text
```

### Modules

- Salyangoz (http://salyangoz.me)
- Rates
- Weather (http://openweathermap.org)
