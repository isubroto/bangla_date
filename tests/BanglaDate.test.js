'use strict';

const BanglaDate = require('../src/BanglaDate');

describe('BanglaDate', () => {
    describe('constructor', () => {
        it('should create a valid BanglaDate object', () => {
            const date = new BanglaDate('2024-03-12');
            expect(date).toBeInstanceOf(BanglaDate);
        });
    });

    describe('static methods', () => {
        it('should create BanglaDate from now()', () => {
            const date = BanglaDate.now();
            expect(date).toBeInstanceOf(BanglaDate);
        });

        it('should parse date strings', () => {
            const date = BanglaDate.parse('2024-03-12');
            expect(date).toBeInstanceOf(BanglaDate);
        });

        it('should create date from UTC values', () => {
            const date = BanglaDate.UTC(2024, 2, 12); // March 12, 2024
            expect(date).toBeInstanceOf(BanglaDate);
            expect(date.getUTCMonth()).toBeDefined();
        });
    });

    describe('getters', () => {
        const date = new BanglaDate('2024-03-12');

        it('should get date components', () => {
            expect(typeof date.getDate()).toBe('number');
            expect(typeof date.getMonth()).toBe('number');
            expect(typeof date.getFullYear()).toBe('number');
            expect(typeof date.getDay()).toBe('number');
        });

        it('should get UTC date components', () => {
            expect(typeof date.getUTCDate()).toBe('number');
            expect(typeof date.getUTCMonth()).toBe('number');
            expect(typeof date.getUTCFullYear()).toBe('number');
            expect(typeof date.getUTCDay()).toBe('number');
        });

        it('should get time components', () => {
            expect(typeof date.getHours()).toBe('number');
            expect(typeof date.getMinutes()).toBe('number');
            expect(typeof date.getSeconds()).toBe('number');
            expect(typeof date.getMilliseconds()).toBe('number');
            expect(typeof date.getTime()).toBe('number');
            expect(typeof date.getTimezoneOffset()).toBe('number');
        });

        it('should get UTC time components', () => {
            expect(typeof date.getUTCHours()).toBe('number');
            expect(typeof date.getUTCMinutes()).toBe('number');
            expect(typeof date.getUTCSeconds()).toBe('number');
            expect(typeof date.getUTCMilliseconds()).toBe('number');
        });
    });

    describe('setters', () => {
        let date;

        beforeEach(() => {
            date = new BanglaDate('2024-03-12');
        });

        it('should set date components', () => {
            const newTime = date.setDate(15);
            expect(typeof newTime).toBe('number');
            expect(date.getDate()).toBe(15);
        });

        it('should set month', () => {
            const newTime = date.setMonth(5);
            expect(typeof newTime).toBe('number');
            expect(date.getMonth()).toBe(5);
        });

        it('should set year', () => {
            const newTime = date.setFullYear(1430);
            expect(typeof newTime).toBe('number');
            expect(date.getFullYear()).toBe(1430);
        });

        it('should set time components', () => {
            expect(typeof date.setHours(12)).toBe('number');
            expect(typeof date.setMinutes(30)).toBe('number');
            expect(typeof date.setSeconds(45)).toBe('number');
            expect(typeof date.setMilliseconds(500)).toBe('number');
            expect(typeof date.setTime(Date.now())).toBe('number');
        });
    });

    describe('string representations', () => {
        const date = new BanglaDate('2024-03-12');

        it('should convert to string', () => {
            const str = date.toString();
            expect(typeof str).toBe('string');
            expect(str).toContain('bar'); // All Bangla days end with 'bar'
        });

        it('should convert to date string', () => {
            expect(typeof date.toDateString()).toBe('string');
        });

        it('should convert to time string', () => {
            expect(typeof date.toTimeString()).toBe('string');
        });

        it('should convert to locale string', () => {
            expect(typeof date.toLocaleString()).toBe('string');
            expect(typeof date.toLocaleDateString()).toBe('string');
            expect(typeof date.toLocaleTimeString()).toBe('string');
        });

        it('should convert to UTC string', () => {
            expect(typeof date.toUTCString()).toBe('string');
        });

        it('should convert to JSON', () => {
            expect(typeof date.toJSON()).toBe('string');
            expect(typeof date.toISOString()).toBe('string');
        });

        it('should handle primitive conversion', () => {
            expect(typeof date[Symbol.toPrimitive]('number')).toBe('number');
            expect(typeof date[Symbol.toPrimitive]('string')).toBe('string');
            expect(typeof date[Symbol.toPrimitive]('default')).toBe('string');
        });
    });
});