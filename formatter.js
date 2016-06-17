class Formatter {
    log() {
        console.log.apply(console, arguments);
    }
}

const formatter = new Formatter();

module.exports = formatter;
