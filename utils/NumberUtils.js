class NumberUtils {
    static getRandomInt(min, max) {
       return Math.floor(Math.random() * (max - min)) + min;
    }
}

module.exports = NumberUtils;
