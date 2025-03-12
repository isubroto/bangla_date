'use strict';

/**
 * Constants for Bangla calendar calculations based on Surya Siddhanta
 */
const BANGLA_EPOCH = 1238178; // Days from Julian Day 0 to Bangla calendar epoch (14 April 593 CE)
const MONTHS = ['Boishakh', 'Joishtho', 'Asharh', 'Shrabon', 'Bhadro', 'Ashwin', 
                'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro'];
const DAYS = ['Robibar', 'Sombar', 'Mongolbar', 'Budhbar', 'Brihoshpotibar', 'Shukrobar', 'Shonibar'];

// Regional variations for month names
const REGIONAL_MONTHS = {
    'west-bengal': ['Baisakh', 'Jaishtha', 'Ashadh', 'Shraban', 'Bhadra', 'Ashwin',
                   'Kartik', 'Agrahayon', 'Poush', 'Magh', 'Phalgun', 'Chaitra'],
    'chittagong': ['Boishakh', 'Joishtho', 'Asharh', 'Shrabon', 'Bhadro', 'Ashwin',
                   'Kartik', 'Ogrohayon', 'Poush', 'Magh', 'Falgun', 'Choitro']
};

/**
 * Converts Gregorian date to Julian Day Number
 * @private
 */
function gregorianToJD(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    return day + Math.floor((153 * m + 2) / 5) + 365 * y + 
           Math.floor(y / 4) - Math.floor(y / 100) + 
           Math.floor(y / 400) - 32045;
}

/**
 * Converts Julian Day Number to Bangla Date
 * @private
 */
function jdToBangla(jd) {
    // Calculate elapsed days since Bangla epoch
    const elapsedDays = jd - BANGLA_EPOCH;

    // Calculate the number of complete 400-year cycles
    const c400 = Math.floor(elapsedDays / 146097);
    let r400 = elapsedDays % 146097;

    // Calculate the number of complete 100-year cycles within the current 400-year cycle
    let c100 = Math.floor(r400 / 36524);
    let r100 = r400 % 36524;

    // Special handling for end of 400-year cycle
    if (c100 === 4) {
        c100 = 3;
        r100 = 36524;
    }

    // Calculate the number of complete 4-year cycles within the current century
    const c4 = Math.floor(r100 / 1461);
    const r4 = r100 % 1461;

    // Calculate the number of complete years within the current 4-year cycle
    let c1 = Math.floor(r4 / 365);
    let r1 = r4 % 365;

    // Special handling for end of 4-year cycle
    if (c1 === 4) {
        c1 = 3;
        r1 = 365;
    }

    // Calculate total years and offset from Bangla epoch (593 CE)
    const year = 400 * c400 + 100 * c100 + 4 * c4 + c1 + 593;

    // Calculate month and day using remaining days
    const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];

    // Adjust Falgun length for leap years
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        monthLengths[10] = 31;
    }

    let month = 0;
    let remainingDays = r1;

    while (month < 12 && remainingDays >= monthLengths[month]) {
        remainingDays -= monthLengths[month];
        month++;
    }

    return {
        year,
        month,
        day: remainingDays + 1
    };
}

/**
 * Converts Bangla Date to Julian Day Number
 * @private
 */
function banglaToJD(year, month, day) {
    // Normalize month and year
    if (month >= 12) {
        year += Math.floor(month / 12);
        month = month % 12;
    }

    // Calculate years since Bangla epoch (593 CE)
    const y = year - 593;

    // Calculate complete days before the current year using cycle-based calculation
    let days = Math.floor(y / 400) * 146097 +
               Math.floor((y % 400) / 100) * 36524 +
               Math.floor((y % 100) / 4) * 1461 +
               (y % 4) * 365;

    // Add days for completed months
    const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];

    // Adjust Falgun length for leap years
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        monthLengths[10] = 31;
    }

    // Add days from completed months in current year
    for (let i = 0; i < month; i++) {
        days += monthLengths[i];
    }

    // Add days in current month and the epoch offset
    return BANGLA_EPOCH + days + (day - 1);
}

class BanglaDate {
    constructor(...args) {
        this._date = new Date(...args);
        this._julianDay = gregorianToJD(this._date);
        this._banglaDate = jdToBangla(this._julianDay);
    }

    // Static methods
    static now() {
        return new BanglaDate();
    }

    static parse(dateString) {
        return new BanglaDate(Date.parse(dateString));
    }

    static UTC(...args) {
        return new BanglaDate(Date.UTC(...args));
    }

    // Getters
    getDate() {
        return this._banglaDate.day;
    }

    getDay() {
        return this._date.getDay();
    }

    getFullYear() {
        return this._banglaDate.year;
    }

    getMonth() {
        return this._banglaDate.month;
    }

    // UTC variants
    getUTCDate() {
        const utcDate = new Date(this._date.getTime());
        utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
        return jdToBangla(gregorianToJD(utcDate)).day;
    }

    getUTCDay() {
        return this._date.getUTCDay();
    }

    getUTCFullYear() {
        const utcDate = new Date(this._date.getTime());
        utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
        return jdToBangla(gregorianToJD(utcDate)).year;
    }

    getUTCMonth() {
        const utcDate = new Date(this._date.getTime());
        utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
        return jdToBangla(gregorianToJD(utcDate)).month;
    }

    // Time getters (same as Gregorian)
    getHours() { return this._date.getHours(); }
    getUTCHours() { return this._date.getUTCHours(); }
    getMinutes() { return this._date.getMinutes(); }
    getUTCMinutes() { return this._date.getUTCMinutes(); }
    getSeconds() { return this._date.getSeconds(); }
    getUTCSeconds() { return this._date.getUTCSeconds(); }
    getMilliseconds() { return this._date.getMilliseconds(); }
    getUTCMilliseconds() { return this._date.getUTCMilliseconds(); }
    getTime() { return this._date.getTime(); }
    getTimezoneOffset() { return this._date.getTimezoneOffset(); }

    // Setters
    setDate(date) {
        const newJD = banglaToJD(this._banglaDate.year, this._banglaDate.month, date);
        this._julianDay = newJD;
        this._banglaDate = jdToBangla(newJD);
        return this.getTime();
    }

    setFullYear(year) {
        const newJD = banglaToJD(year, this._banglaDate.month, this._banglaDate.day);
        this._julianDay = newJD;
        this._banglaDate = jdToBangla(newJD);
        return this.getTime();
    }

    setMonth(month) {
        const newJD = banglaToJD(this._banglaDate.year, month, this._banglaDate.day);
        this._julianDay = newJD;
        this._banglaDate = jdToBangla(newJD);
        return this.getTime();
    }

    // Time setters (same as Gregorian)
    setHours(hours) { this._date.setHours(hours); return this.getTime(); }
    setUTCHours(hours) { this._date.setUTCHours(hours); return this.getTime(); }
    setMinutes(minutes) { this._date.setMinutes(minutes); return this.getTime(); }
    setUTCMinutes(minutes) { this._date.setUTCMinutes(minutes); return this.getTime(); }
    setSeconds(seconds) { this._date.setSeconds(seconds); return this.getTime(); }
    setUTCSeconds(seconds) { this._date.setUTCSeconds(seconds); return this.getTime(); }
    setMilliseconds(ms) { this._date.setMilliseconds(ms); return this.getTime(); }
    setUTCMilliseconds(ms) { this._date.setUTCMilliseconds(ms); return this.getTime(); }
    setTime(time) { this._date.setTime(time); return time; }

    // String representations
    toString(region = 'bangladesh') {
        const monthArray = region === 'west-bengal' ? REGIONAL_MONTHS['west-bengal'] :
                         region === 'chittagong' ? REGIONAL_MONTHS['chittagong'] : MONTHS;

        const month = this._banglaDate.month;
        if (month < 0 || month >= monthArray.length) {
            throw new Error('Invalid month index');
        }

        return `${DAYS[this.getDay()]} ${this.getDate()} ${monthArray[month]} ${this.getFullYear()}`;
    }

    toDateString() {
        return `${DAYS[this.getDay()]} ${MONTHS[this.getMonth()]} ${this.getDate()} ${this.getFullYear()}`;
    }

    toTimeString() {
        return this._date.toTimeString();
    }

    toLocaleString() {
        return `${this.toDateString()} ${this.toTimeString()}`;
    }

    toLocaleDateString() {
        return this.toDateString();
    }

    toLocaleTimeString() {
        return this.toTimeString();
    }

    toUTCString() {
        const utcDate = new BanglaDate(this._date.getTime());
        utcDate._date.setMinutes(utcDate._date.getMinutes() + utcDate._date.getTimezoneOffset());
        return utcDate.toString();
    }

    toJSON() {
        return this._date.toJSON();
    }

    toISOString() {
        return this._date.toISOString();
    }

    valueOf() {
        return this._date.valueOf();
    }

    [Symbol.toPrimitive](hint) {
        if (hint === 'number') return this.valueOf();
        if (hint === 'string') return this.toString();
        return this.toString();
    }
}

module.exports = BanglaDate;