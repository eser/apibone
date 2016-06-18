# apibone

A tiny and modular backbone which is designed to operate various service queries with text inputs or URL addresses.

### Installation
```sh
npm install -g apibone
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
