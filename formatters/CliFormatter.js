class CliFormatter {
    json() {
        console.log.apply(console, arguments);
    }

    end() {
    }
}

module.exports = CliFormatter;
