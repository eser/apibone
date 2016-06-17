class WebFormatter {
    constructor(res) {
        this.res = res;
    }

    json() {
        this.res.json.apply(this.res, arguments);
    }

    end() {
    }
}

module.exports = WebFormatter;
