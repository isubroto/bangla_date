'use strict';

/**
 * Constants for Bangla calendar calculations based on Surya Siddhanta
 */
const GREGORIAN_OFFSET = 1947177.2; // Julian Day Number for April 14, 593 CE
const SURYA_SIDDHANTA_YEAR = 365.25875648; // Precise Surya Siddhanta solar year length
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
 * Convert Gregorian date to Julian Day Number
 * @private
 */
function gregorianToJD(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + 
               Math.floor(y / 4) - Math.floor(y / 100) + 
               Math.floor(y / 400) - 32045;

    return jd + 0.5; // Add 0.5 to start days at noon
}

/**
 * Convert Julian Day Number to Bangla Date
 * @private
 */
function jdToBangla(jd) {
    // Calculate days since epoch
    const daysFromEpoch = jd - GREGORIAN_OFFSET;
    console.log(`Days from epoch: ${daysFromEpoch}`);

    // Calculate years since epoch using Surya Siddhanta year length
    const yearsSinceEpoch = Math.floor(daysFromEpoch / SURYA_SIDDHANTA_YEAR);
    let banglaYear = yearsSinceEpoch + 593;
    console.log(`Initial Bangla year: ${banglaYear}`);

    // Calculate the start of the current year
    const yearStart = GREGORIAN_OFFSET + (yearsSinceEpoch * SURYA_SIDDHANTA_YEAR);
    let dayOfYear = jd - yearStart;
    console.log(`Days into year: ${dayOfYear}`);

    // Adjust if we're before the start of the year
    if (dayOfYear < 0) {
        banglaYear--;
        const prevYearStart = GREGORIAN_OFFSET + ((yearsSinceEpoch - 1) * SURYA_SIDDHANTA_YEAR);
        dayOfYear = jd - prevYearStart;
        console.log(`Adjusted to previous year: ${banglaYear}, new days into year: ${dayOfYear}`);
    }

    // Get month lengths based on Surya Siddhanta
    const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];

    // Adjust Falgun length for leap years
    if (banglaYear % 4 === 0 && (banglaYear % 100 !== 0 || banglaYear % 400 === 0)) {
        monthLengths[10] = 31;
    }

    // Find month and day
    let month = 0;
    let remainingDays = Math.floor(dayOfYear);

    while (month < 12 && remainingDays >= monthLengths[month]) {
        remainingDays -= monthLengths[month];
        month++;
    }

    console.log(`Final calculation: year=${banglaYear}, month=${month}, day=${remainingDays + 1}`);

    return {
        year: banglaYear,
        month: month,
        day: remainingDays + 1
    };
}

/**
 * Convert Bangla Date to Julian Day Number
 * @private
 */
function banglaToJD(year, month, day) {
    // Calculate years since epoch using Surya Siddhanta year length
    const yearsSinceEpoch = year - 593;
    console.log(`Years since epoch: ${yearsSinceEpoch}`);

    // Calculate days up to the start of the year
    let jd = GREGORIAN_OFFSET + (yearsSinceEpoch * SURYA_SIDDHANTA_YEAR);
    console.log(`Base JD: ${jd}`);

    // Add days for completed months
    const monthLengths = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 30];
    if (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) {
        monthLengths[10] = 31;
    }

    let daysFromMonths = 0;
    for (let i = 0; i < month; i++) {
        daysFromMonths += monthLengths[i];
    }
    console.log(`Days from months: ${daysFromMonths}`);

    // Add days in current month
    const finalJD = Math.floor(jd + daysFromMonths + (day - 1));
    console.log(`Final JD: ${finalJD}`);

    return finalJD;
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

    // Instance methods
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
    setTime(time) { this._date.setTime(time); return this.getTime(); }

    // String representations
    toString(region = 'bangladesh') {
        const monthArray = region === 'west-bengal' ? REGIONAL_MONTHS['west-bengal'] :
                         region === 'chittagong' ? REGIONAL_MONTHS['chittagong'] : MONTHS;

        return `${DAYS[this.getDay()]} ${this.getDate()} ${monthArray[this.getMonth()]} ${this.getFullYear()}`;
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
        const utcDate = new Date(this._date.getTime());
        utcDate.setMinutes(utcDate.getMinutes() + utcDate.getTimezoneOffset());
        const bangla = jdToBangla(gregorianToJD(utcDate));
        return `${DAYS[utcDate.getUTCDay()]} ${bangla.day} ${MONTHS[bangla.month]} ${bangla.year}`;
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