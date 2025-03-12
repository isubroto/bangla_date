'use strict';

const BanglaDate = require('../src/BanglaDate');

describe('BanglaDate', () => {
    describe('constructor', () => {
        it('should create a valid BanglaDate object', () => {
            const date = new BanglaDate('2024-03-12');
            expect(date).toBeInstanceOf(BanglaDate);
        });

        it('should handle leap years correctly', () => {
            // 2024 is a leap year
            const leapDate = new BanglaDate('2024-02-29');
            expect(leapDate.getMonth()).toBe(10); // Should be Falgun
            expect(leapDate.getDate()).toBe(17);
        });

        it('should handle historical dates accurately', () => {
            // Test a known historical date
            const historicalDate = new BanglaDate('1971-03-26'); // Bangladesh Independence Day
            expect(historicalDate.getFullYear()).toBe(1377);
            expect(historicalDate.getMonth()).toBe(11); // Choitro
            expect(historicalDate.getDate()).toBe(12);
        });

        it('should handle significant historical dates', () => {
            // Language Movement Day
            const languageDay = new BanglaDate('1952-02-21');
            expect(languageDay.getFullYear()).toBe(1358);
            expect(languageDay.getMonth()).toBe(10); // Falgun
            expect(languageDay.getDate()).toBe(8);

            // First Partition of Bengal
            const bengalPartition = new BanglaDate('1905-10-16');
            expect(bengalPartition.getFullYear()).toBe(1312);
            expect(bengalPartition.getMonth()).toBe(5); // Ashwin
            expect(bengalPartition.getDate()).toBe(29);

            // Victory Day
            const victoryDay = new BanglaDate('1971-12-16');
            expect(victoryDay.getFullYear()).toBe(1378);
            expect(victoryDay.getMonth()).toBe(8); // Poush
            expect(victoryDay.getDate()).toBe(1);
        });
    });

    describe('regional variations', () => {
        it('should handle West Bengal month names', () => {
            const date = new BanglaDate('2024-04-14');
            expect(date.toString('west-bengal')).toContain('Baisakh');
            expect(date.toString('west-bengal')).not.toContain('Boishakh');
        });

        it('should handle Chittagong regional variations', () => {
            const date = new BanglaDate('2024-04-14');
            expect(date.toString('chittagong')).toContain('Boishakh');
            expect(date.toString('chittagong')).not.toContain('Baisakh');
        });

        it('should default to Bangladesh standard', () => {
            const date = new BanglaDate('2024-04-14');
            expect(date.toString()).toContain('Boishakh');
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
            const date = BanglaDate.UTC(2024, 2, 12);
            expect(date).toBeInstanceOf(BanglaDate);
            expect(date.getUTCMonth()).toBeDefined();
        });
    });

    describe('month transitions', () => {
        it('should handle month transitions correctly', () => {
            const date = new BanglaDate('2024-04-14'); // Pohela Boishakh
            expect(date.getFullYear()).toBe(1431);
            expect(date.getMonth()).toBe(0); // Boishakh
            expect(date.getDate()).toBe(1);
        });

        it('should handle last day of month correctly', () => {
            const date = new BanglaDate('2024-05-14');
            expect(date.getMonth()).toBe(0); // Boishakh
            expect(date.getDate()).toBe(31); // Last day of Boishakh
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

        it('should handle date overflow correctly', () => {
            date.setDate(31);
            expect(date.getDate()).toBe(31);
            date.setDate(32); // Should roll over to next month
            expect(date.getDate()).toBe(1);
            expect(date.getMonth()).toBe(11); // Should move to next month
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

        it('should format dates correctly', () => {
            expect(date.toString()).toMatch(/^[A-Za-z]+bar \d{1,2} [A-Za-z]+ \d{4}$/);
            expect(date.toDateString()).toMatch(/^[A-Za-z]+ [A-Za-z]+ \d{1,2} \d{4}$/);
        });

        it('should convert to various string formats', () => {
            expect(typeof date.toDateString()).toBe('string');
            expect(typeof date.toTimeString()).toBe('string');
            expect(typeof date.toLocaleString()).toBe('string');
            expect(typeof date.toLocaleDateString()).toBe('string');
            expect(typeof date.toLocaleTimeString()).toBe('string');
            expect(typeof date.toUTCString()).toBe('string');
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