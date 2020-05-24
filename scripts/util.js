/**
 * Checks if a given string is a valid JSON
 * 
 * @param {String} string string to check
 * 
 * @returns true if is a valid JSON, false otherwise
 */
function isValidJson(string) {
    try {
        JSON.parse(string);
        return true;
    } catch (e) {
        return false;
    }
}
