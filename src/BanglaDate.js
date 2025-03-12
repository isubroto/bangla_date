'use strict';

/**
 * Constants for Bangla calendar calculations based on Surya Siddhanta
 */
const BANGLA_EPOCH = 1238178; // Days from Julian Day 0 to Bangla calendar epoch
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
    const banglaDay = jd - BANGLA_EPOCH;
    const year = Math.floor(banglaDay / 365.25);
    const dayOfYear = banglaDay - Math.floor(year * 365.25);

    // Month lengths based on Surya Siddhanta
    const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];

    // Adjust for leap years
    const adjustedYear = year + 594;
    if (adjustedYear % 4 === 0 && (adjustedYear % 100 !== 0 || adjustedYear % 400 === 0)) {
        monthLengths[10] = 31; // Falgun gets an extra day in leap years
    }

    let month = 0;
    let remainingDays = dayOfYear;

    while (month < 12 && remainingDays >= monthLengths[month]) {
        remainingDays -= monthLengths[month];
        month++;
    }

    return {
        year: adjustedYear,
        month: month,
        day: Math.floor(remainingDays) + 1
    };
}

/**
 * Converts Bangla Date to Julian Day Number
 * @private
 */
function banglaToJD(year, month, day) {
    const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];

    // Adjust for leap years
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        monthLengths[10] = 31;
    }

    let dayOfYear = day - 1;
    for (let i = 0; i < month; i++) {
        dayOfYear += monthLengths[i];
    }

    const adjustedYear = year - 594;
    return Math.floor(BANGLA_EPOCH + adjustedYear * 365.25 + dayOfYear);
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

    getUTCDate() {
        const utcDate = new Date(this._date.getTime());
        utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
        return jdToBangla(gregorianToJD(utcDate)).day;
    }

    getDay() {
        return this._date.getDay();
    }

    getUTCDay() {
        return this._date.getUTCDay();
    }

    getFullYear() {
        return this._banglaDate.year;
    }

    getUTCFullYear() {
        const utcDate = new Date(this._date.getTime());
        utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
        return jdToBangla(gregorianToJD(utcDate)).year;
    }

    getMonth() {
        return this._banglaDate.month;
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
        this._date = new Date(this._date.getTime());
        return this.getTime();
    }

    setFullYear(year) {
        const newJD = banglaToJD(year, this._banglaDate.month, this._banglaDate.day);
        this._julianDay = newJD;
        this._banglaDate = jdToBangla(newJD);
        this._date = new Date(this._date.getTime());
        return this.getTime();
    }

    setMonth(month) {
        const newJD = banglaToJD(this._banglaDate.year, month, this._banglaDate.day);
        this._julianDay = newJD;
        this._banglaDate = jdToBangla(newJD);
        this._date = new Date(this._date.getTime());
        return this.getTime();
    }

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