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
apibone test anyCommand --anyParam=anyValue --anyOptionalParam
```

### Web Usage
```sh
npm start

# Example:
http://localhost:3000/salyangoz?limit=2
http://localhost:3000/test/anyCommand?anyParam=anyValue&anyOptionalParam&format=text
```

### Modules

- Salyangoz (http://salyangoz.me)
