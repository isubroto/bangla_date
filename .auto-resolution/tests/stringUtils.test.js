'use strict';

const { capitalizeWords, reverse, countOccurrences, ValidationError } = require('../src');

describe('String Utils', () => {
    describe('capitalizeWords', () => {
        it('should capitalize first letter of each word', () => {
            expect(capitalizeWords('hello world')).toBe('Hello World');
            expect(capitalizeWords('HELLO WORLD')).toBe('Hello World');
            expect(capitalizeWords('hello WORLD')).toBe('Hello World');
        });

        it('should handle empty string', () => {
            expect(capitalizeWords('')).toBe('');
        });

        it('should throw ValidationError for non-string input', () => {
            expect(() => capitalizeWords(123)).toThrow(ValidationError);
            expect(() => capitalizeWords(null)).toThrow(ValidationError);
        });
    });

    describe('reverse', () => {
        it('should reverse the string', () => {
            expect(reverse('hello')).toBe('olleh');
            expect(reverse('Hello World')).toBe('dlroW olleH');
        });

        it('should handle empty string', () => {
            expect(reverse('')).toBe('');
        });

        it('should throw ValidationError for non-string input', () => {
            expect(() => reverse(123)).toThrow(ValidationError);
            expect(() => reverse(null)).toThrow(ValidationError);
        });
    });

    describe('countOccurrences', () => {
        it('should count substring occurrences', () => {
            expect(countOccurrences('hello hello world', 'hello')).toBe(2);
            expect(countOccurrences('hello world', 'xyz')).toBe(0);
        });

        it('should handle empty strings', () => {
            expect(countOccurrences('', 'test')).toBe(0);
            expect(countOccurrences('test', '')).toBe(0);
        });

        it('should throw ValidationError for non-string inputs', () => {
            expect(() => countOccurrences(123, 'test')).toThrow(ValidationError);
            expect(() => countOccurrences('test', 123)).toThrow(ValidationError);
        });
    });
});
