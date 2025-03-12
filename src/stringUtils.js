'use strict';

const { ValidationError } = require('./errors');

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} text - The input string to capitalize
 * @returns {string} The capitalized string
 * @throws {ValidationError} If input is not a string
 */
function capitalizeWords(text) {
    if (typeof text !== 'string') {
        throw new ValidationError('Input must be a string');
    }

    return text
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

/**
 * Reverses a string
 * @param {string} text - The input string to reverse
 * @returns {string} The reversed string
 * @throws {ValidationError} If input is not a string
 */
function reverse(text) {
    if (typeof text !== 'string') {
        throw new ValidationError('Input must be a string');
    }

    return text.split('').reverse().join('');
}

/**
 * Counts the occurrence of a substring in a string
 * @param {string} text - The main string
 * @param {string} substring - The substring to count
 * @returns {number} Number of occurrences
 * @throws {ValidationError} If either input is not a string
 */
function countOccurrences(text, substring) {
    if (typeof text !== 'string' || typeof substring !== 'string') {
        throw new ValidationError('Both inputs must be strings');
    }

    if (substring.length === 0) {
        return 0;
    }

    return text.split(substring).length - 1;
}

module.exports = {
    capitalizeWords,
    reverse,
    countOccurrences
};
