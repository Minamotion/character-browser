/**
 * Copies the text to clipboard
 * @param {string} text Text to copy
 * @returns {Promise<void>} A promise that returns nothing
 */
async function copy(text) {
	return navigator.clipboard.writeText(text);
}

/**
 * Returns character codes
 * @param {number} first First character code to iterate from
 * @returns {Generator<number>} A character code inside `.next().value`
 */
function* allCharacters(first = 0) {
	for (let i = (first > 0) ? first : 0; first <= 65535; i++) {
		yield i
	}
}

/**
 * Checks if a string will not return `NaN` when passed through `Number.parseInt()`
 * @param {string} x String to check
 * @returns {boolean}
 */
function isParseableInt(x = "10") {
	return Number.isInteger(Number.parseInt(x))
}

/**
 * Pads a string with trailing `0`s
 * @param {string} string The string to be padded
 * @param {number} size How many trailing `0`s?
 * @returns {string} The new string
 */
function padString(string, size) {
	while (string.length < size) string = "0" +string
	return string
}