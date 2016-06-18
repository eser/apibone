class StringUtils {
    static capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

module.exports = StringUtils;
