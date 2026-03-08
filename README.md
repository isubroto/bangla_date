# @subrotosaha/bangla-date

[![npm version](https://img.shields.io/npm/v/@subrotosaha/bangla-date)](https://www.npmjs.com/package/@subrotosaha/bangla-date)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)

A zero-dependency TypeScript library for working with the **Bangla (Bengali) calendar** (Bangabda / বঙ্গাব্দ). It converts Gregorian dates to Bangla calendar dates, formats them in English, Bengali, and Hindi, and provides a rich set of arithmetic, comparison, and formatting utilities.

---

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Language Support](#language-support)
- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [Static Factory Methods](#static-factory-methods)
  - [Validity](#validity)
  - [Comparison Methods](#comparison-methods)
  - [Arithmetic Methods](#arithmetic-methods)
  - [Start / End Helpers](#start--end-helpers)
  - [Calendar Info](#calendar-info)
  - [Accessor Methods](#accessor-methods)
  - [Formatting Methods](#formatting-methods)
  - [Utility / Conversion](#utility--conversion)
  - [Error Types](#error-types)
- [Format Tokens](#format-tokens)
- [Changelog](#changelog)

---

## Features

- Convert any Gregorian `Date` to the Bangla calendar (revised Bangladesh National Calendar, Pohela Boishakh = April 14 UTC).
- Output in **English** (`en`), **Bengali** (`bn`), or **Hindi** (`hi`) — including localised digits and month/weekday names.
- Arithmetic: `add()`, `subtract()`, `diff()` for days, months, and years.
- Comparison: `isBefore()`, `isAfter()`, `isSame()` with year/month/day granularity.
- Start/end of month and year helpers.
- Season (`getRitu()`), era (`getEra()`), ordinal date (`getOrdinalDate()`), festivals (`getFestival()`), and relative time (`relativeTime()`).
- `format()` with a rich token set (see [Format Tokens](#format-tokens)).
- `Intl.DateTimeFormat`-powered `toLocaleDateString()`, `toLocaleString()`, `toLocaleTimeString()`.
- Parse a Bangla date string back to a `BanglaDate` via `BanglaDate.parse()`.
- Full leap-year support (Chaitra = 31 days when the next Gregorian year is a leap year).
- Zero runtime dependencies.

---

## Installation

```bash
npm install @subrotosaha/bangla-date
```

---

## Quick Start

```js
import BanglaDate from "@subrotosaha/bangla-date";

// Today's date in English
const today = BanglaDate.today("en");
console.log(today.toString());
// e.g. "24 Falgun 1432 BA"

// Today in Bengali
const todayBN = BanglaDate.today("bn");
console.log(todayBN.toString());
// e.g. "২৪ ফাল্গুন ১৪৩২ বঙ্গাব্দ"

// From a specific Gregorian date
const d = new BanglaDate(new Date("2025-04-14"), "en");
console.log(d.format("DD MMMM YYYY era")); // "01 Boishakh 1432 BA"
console.log(d.getOrdinalDate()); // "1st"

// Arithmetic
const next = d.add(30, "days");
console.log(next.toString()); // "01 Jyoishtho 1432 BA"

// Parse from Bangla date string
const parsed = BanglaDate.parse("1 Boishakh 1432");
console.log(parsed.toGregorian().toISOString()); // "2025-04-14T00:00:00.000Z"
```

---

## Language Support

| Code | Language | Digits | Example output               |
| ---- | -------- | ------ | ---------------------------- |
| `en` | English  | 0–9    | `"24 Falgun 1432 BA"`        |
| `bn` | Bengali  | ০–৯    | `"২৪ ফাল্গুন ১৪৩২ বঙ্গাব্দ"` |
| `hi` | Hindi    | ०–९    | `"२४ फाल्गुन १४३२ बंगाब्द"`  |

The `language` parameter is accepted by the constructor and by every static factory method. All text-returning instance methods (month names, weekday names, era, season, ordinal, relative time, etc.) respect the language set at construction time.

---

## API Reference

### Constructor

```ts
new BanglaDate(gregorianDate: Date, language?: 'en' | 'bn' | 'hi'): BanglaDate
```

Creates a `BanglaDate` from a standard JavaScript `Date` object.

| Parameter       | Type                   | Default | Description                                         |
| --------------- | ---------------------- | ------- | --------------------------------------------------- |
| `gregorianDate` | `Date`                 | —       | Any valid JS `Date`. Time components are preserved. |
| `language`      | `'en' \| 'bn' \| 'hi'` | `'en'`  | Output language for all text-returning methods.     |

```js
const d = new BanglaDate(new Date("2025-04-14T06:00:00Z"), "bn");
d.toString(); // "১ বৈশাখ ১৪৩২ বঙ্গাব্দ"
```

---

### Static Factory Methods

#### `BanglaDate.now(language?)`

```ts
BanglaDate.now(language?: 'en' | 'bn' | 'hi'): BanglaDate
```

Returns a `BanglaDate` for the current moment with the full time-of-day preserved.  
Use `today()` when you only need date semantics (midnight UTC).

| Parameter  | Default |
| ---------- | ------- |
| `language` | `'en'`  |

```js
BanglaDate.now("bn").toString(); // e.g. "২৪ ফাল্গুন ১৪৩২ বঙ্গাব্দ"
```

---

#### `BanglaDate.today(language?)`

```ts
BanglaDate.today(language?: 'en' | 'bn' | 'hi'): BanglaDate
```

Returns a `BanglaDate` set to **midnight UTC** of today. Equivalent to `now()` without time components.

| Parameter  | Default |
| ---------- | ------- |
| `language` | `'en'`  |

```js
BanglaDate.today("hi").format("DD MMMM YYYY era");
// "२४ फाल्गुन १४३२ बंगाब्द"
```

---

#### `BanglaDate.fromBanglaDate(year, month, day, language?)`

```ts
BanglaDate.fromBanglaDate(
  year: number,
  month: number,
  day: number,
  language?: 'en' | 'bn' | 'hi'
): BanglaDate
```

Creates a `BanglaDate` from explicit Bangla calendar components.

| Parameter  | Type     | Default | Description                                   |
| ---------- | -------- | ------- | --------------------------------------------- |
| `year`     | `number` | —       | Bangla year (e.g. `1432`)                     |
| `month`    | `number` | —       | 1-indexed month (1 = Boishakh … 12 = Chaitra) |
| `day`      | `number` | —       | Day of month                                  |
| `language` | `string` | `'en'`  | Output language                               |

**Throws** `BanglaDateRangeError` if month or day is out of range.

```js
BanglaDate.fromBanglaDate(1432, 1, 1, "en").toString();
// "1 Boishakh 1432 BA"
```

---

#### `BanglaDate.parse(dateString, language?)`

```ts
BanglaDate.parse(dateString: string, language?: 'en' | 'bn' | 'hi'): BanglaDate
```

Parses a Bangla date string in the format `"DD MonthName YYYY"` (English month names only).

| Parameter    | Type     | Default | Description                                                |
| ------------ | -------- | ------- | ---------------------------------------------------------- |
| `dateString` | `string` | —       | e.g. `"15 Boishakh 1432"`. Month name is case-insensitive. |
| `language`   | `string` | `'en'`  | Language for the returned instance.                        |

**Throws** `BanglaDateParseError` on malformed input, `BanglaDateRangeError` if the day is out of range.

```js
BanglaDate.parse("15 Boishakh 1432", "bn").toString();
// "১৫ বৈশাখ ১৪৩২ বঙ্গাব্দ"
```

Valid month names: `Boishakh`, `Jyoishtho`, `Asharh`, `Shrabon`, `Bhadro`, `Ashwin`, `Kartik`, `Ogrohayon`, `Poush`, `Magh`, `Falgun`, `Chaitra`.

---

#### `BanglaDate.isLeapYear(year)`

```ts
BanglaDate.isLeapYear(year: number): boolean
```

Returns `true` when the given **Gregorian** year is a leap year using the standard proleptic rule (÷4 except centuries unless ÷400).

> Pass the Gregorian year, not the Bangla year.

```js
BanglaDate.isLeapYear(2024); // true
BanglaDate.isLeapYear(1900); // false
BanglaDate.isLeapYear(2000); // true
```

---

#### `BanglaDate.getMonthLengths(gregorianRefYear)`

```ts
BanglaDate.getMonthLengths(gregorianRefYear: number): number[]
```

Returns an array of 12 day-counts for the Bangla year whose Pohela Boishakh falls in `gregorianRefYear`.  
Months 1–5 = 31 days, months 6–11 = 30 days, month 12 (Chaitra) = 30 or 31 days.

```js
BanglaDate.getMonthLengths(2024);
// [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30, 31]  (2025 is leap → Chaitra = 31)
```

---

#### `BanglaDate.isValidBanglaDate(year, month, day)`

```ts
BanglaDate.isValidBanglaDate(year: number, month: number, day: number): boolean
```

Returns `true` when the given Bangla calendar components form a valid date.

```js
BanglaDate.isValidBanglaDate(1432, 12, 31); // false (Chaitra max 30 in non-leap)
BanglaDate.isValidBanglaDate(1432, 1, 31); // true
```

---

### Validity

#### `isValid()`

```ts
isValid(): boolean
```

Returns `true` if this instance represents a valid date (underlying `Date` is not `NaN`, month index is 0–11, day is within the allowed range).

---

### Comparison Methods

#### `isBefore(other)`

```ts
isBefore(other: BanglaDate): boolean
```

Returns `true` when this date is strictly before `other` (compares millisecond timestamps).

---

#### `isAfter(other)`

```ts
isAfter(other: BanglaDate): boolean
```

Returns `true` when this date is strictly after `other`.

---

#### `isSame(other, granularity?)`

```ts
isSame(other: BanglaDate, granularity?: 'day' | 'month' | 'year'): boolean
```

Returns `true` when both dates match at the given granularity.

| Parameter     | Type                         | Default | Description              |
| ------------- | ---------------------------- | ------- | ------------------------ |
| `other`       | `BanglaDate`                 | —       | Date to compare against  |
| `granularity` | `'day' \| 'month' \| 'year'` | `'day'` | How precisely to compare |

```js
const a = BanglaDate.fromBanglaDate(1432, 1, 10);
const b = BanglaDate.fromBanglaDate(1432, 1, 20);

a.isSame(b, "year"); // true
a.isSame(b, "month"); // true
a.isSame(b, "day"); // false
```

---

### Arithmetic Methods

#### `add(amount, unit?)`

```ts
add(amount: number, unit?: 'days' | 'months' | 'years'): BanglaDate
```

Returns a **new** `BanglaDate` shifted forward by `amount` of the given unit. Negative values shift into the past. This instance is **not** mutated.

| Parameter | Type                            | Default  | Description                      |
| --------- | ------------------------------- | -------- | -------------------------------- |
| `amount`  | `number`                        | —        | Units to shift (can be negative) |
| `unit`    | `'days' \| 'months' \| 'years'` | `'days'` | Unit of addition                 |

When adding months or years, if the resulting month is shorter than the current day, the day is clamped to the last valid day of the new month.

```js
const d = BanglaDate.fromBanglaDate(1432, 1, 31);
d.add(1, "months").toString(); // "31 Jyoishtho 1432 BA"
d.add(-1, "years").toString(); // "31 Boishakh 1431 BA"
d.add(3, "days").toString(); // "4 Jyoishtho 1432 BA"
```

---

#### `subtract(amount, unit?)`

```ts
subtract(amount: number, unit?: 'days' | 'months' | 'years'): BanglaDate
```

Convenience wrapper around `add(-amount, unit)`. Identical parameters and return type.

```js
BanglaDate.today().subtract(7, "days"); // one week ago
```

---

#### `diff(other, unit?)`

```ts
diff(other: BanglaDate, unit?: 'days' | 'months' | 'years'): number
```

Returns the signed difference between this date and `other`. A **positive** result means this date is **after** `other`.

| Parameter | Type                            | Default  |
| --------- | ------------------------------- | -------- |
| `other`   | `BanglaDate`                    | —        |
| `unit`    | `'days' \| 'months' \| 'years'` | `'days'` |

```js
const start = BanglaDate.fromBanglaDate(1432, 1, 1);
const end = BanglaDate.fromBanglaDate(1432, 3, 15);

end.diff(start, "days"); // 76
end.diff(start, "months"); // 2
end.diff(start, "years"); // 0
```

---

### Start / End Helpers

| Method           | Returns                                        |
| ---------------- | ---------------------------------------------- |
| `startOfMonth()` | New `BanglaDate` at day 1 of this month        |
| `endOfMonth()`   | New `BanglaDate` at the last day of this month |
| `startOfYear()`  | New `BanglaDate` at 1 Boishakh of this year    |
| `endOfYear()`    | New `BanglaDate` at the last day of Chaitra    |

All methods return a new instance; the original is not modified.

```js
const d = BanglaDate.fromBanglaDate(1432, 6, 15);
d.startOfMonth().toString(); // "1 Ashwin 1432 BA"
d.endOfMonth().toString(); // "30 Ashwin 1432 BA"
d.startOfYear().toString(); // "1 Boishakh 1432 BA"
d.endOfYear().toString(); // "30 Chaitra 1432 BA"
```

---

### Calendar Info

#### `getDayOfYear()`

```ts
getDayOfYear(): number
```

Returns the 1-based day number within the Bangla year (1–365 in a common year, 1–366 in a leap year).

```js
BanglaDate.fromBanglaDate(1432, 1, 1).getDayOfYear(); // 1
BanglaDate.fromBanglaDate(1432, 2, 1).getDayOfYear(); // 32
```

---

#### `getRitu()`

```ts
getRitu(): string
```

Returns the Bengali season (Ritu) for the current month, in the instance's language.

| Months             | en       | bn      | hi      |
| ------------------ | -------- | ------- | ------- |
| Boishakh–Jyoishtho | Grishmo  | গ্রীষ্ম | ग्रीष्म |
| Asharh–Shrabon     | Borsha   | বর্ষা   | वर्षा   |
| Bhadro–Ashwin      | Shorot   | শরৎ     | शरद     |
| Kartik–Ogrohayon   | Hemonto  | হেমন্ত  | हेमन्त  |
| Poush–Magh         | Sheet    | শীত     | शीत     |
| Falgun–Chaitra     | Boshonto | বসন্ত   | वसन्त   |

---

#### `getEra()`

```ts
getEra(): string
```

Returns the era label: `"BA"` (English), `"বঙ্গাব্দ"` (Bengali), `"बंगाब्द"` (Hindi).

---

#### `getFestival()`

```ts
getFestival(): string
```

Returns the name of a major Bengali festival on this date, or an empty string if none.

| Date                | en                                 | bn                   |
| ------------------- | ---------------------------------- | -------------------- |
| 1 Boishakh          | Pohela Boishakh (Bengali New Year) | পহেলা বৈশাখ (নববর্ষ) |
| 25 Boishakh         | Rabindra Jayanti                   | রবীন্দ্র জয়ন্তী     |
| 11 Jyoishtho        | Nazrul Jayanti                     | নজরুল জয়ন্তী        |
| Last day of Chaitra | Chaitra Sangkranti (Year end)      | চৈত্র সংক্রান্তি     |

---

#### `relativeTime()`

```ts
relativeTime(): string
```

Returns a human-readable relative time string comparing this date to today.

```js
// Assuming today is 24 Falgun 1432
BanglaDate.fromBanglaDate(1432, 2, 24).relativeTime(); // "in 1 month"
BanglaDate.fromBanglaDate(1431, 1, 1).relativeTime(); // "in 2 years"  (if future)
BanglaDate.today("bn").relativeTime(); // "আজ"
```

---

#### `getOrdinalDate()`

```ts
getOrdinalDate(): string
```

Returns the ordinal form of the day of the month in the instance's language.

| Language | Day 1   | Day 2   | Day 5  | Day 21  |
| -------- | ------- | ------- | ------ | ------- |
| `en`     | `1st`   | `2nd`   | `5th`  | `21st`  |
| `bn`     | `পহেলা` | `দোসরা` | `৫ই`   | `২১শে`  |
| `hi`     | `पहला`  | `दूसरा` | `५वाँ` | `२१वें` |

---

### Accessor Methods

All accessor methods return raw **numbers** (not localised strings). Use `numberToNumber(value, language)` from the utilities export when you need localised digit strings in custom code.

| Method                 | Returns  | Description                                             |
| ---------------------- | -------- | ------------------------------------------------------- |
| `getDate()`            | `number` | Day of the Bangla month (1–31)                          |
| `getDay()`             | `number` | UTC weekday index (0 = Sunday … 6 = Saturday)           |
| `getFullYear()`        | `number` | Full 4-digit Bangla year (e.g. `1432`)                  |
| `getYear()`            | `number` | Alias of `getFullYear()`                                |
| `getMonth()`           | `number` | 1-indexed Bangla month (1 = Boishakh … 12 = Chaitra)    |
| `getHours()`           | `number` | UTC hour (0–23)                                         |
| `getMinutes()`         | `number` | UTC minutes (0–59)                                      |
| `getSeconds()`         | `number` | UTC seconds (0–59)                                      |
| `getMilliseconds()`    | `number` | UTC milliseconds (0–999)                                |
| `getTime()`            | `number` | Unix timestamp in milliseconds                          |
| `getTimezoneOffset()`  | `number` | Host timezone offset in minutes (positive = behind UTC) |
| `getUTCDate()`         | `number` | Gregorian UTC day-of-month                              |
| `getUTCDay()`          | `number` | Gregorian UTC weekday index (0 = Sunday)                |
| `getUTCFullYear()`     | `number` | Gregorian UTC 4-digit year                              |
| `getUTCHours()`        | `number` | UTC hour of the underlying Gregorian timestamp          |
| `getUTCMinutes()`      | `number` | UTC minutes of the underlying Gregorian timestamp       |
| `getUTCSeconds()`      | `number` | UTC seconds of the underlying Gregorian timestamp       |
| `getUTCMilliseconds()` | `number` | UTC milliseconds of the underlying Gregorian timestamp  |
| `getUTCMonth()`        | `number` | Gregorian UTC month index 0-based (**not** Bangla)      |

---

### Formatting Methods

#### `toString()`

Full localised date string: `"15 Boishakh 1432 BA"` / `"১৫ বৈশাখ ১৪৩২ বঙ্গাব্দ"` / `"१५ बैशाख १४३२ बंगाब्द"`.

---

#### `toDateString()`

Short date + weekday string, e.g. `"Monday, 15 Boishakh 1432"`.

---

#### `toISOString()`

ISO 8601-like string using Bangla calendar coordinates: `"1432-01-15T08:26:34.809Z"`.

---

#### `toTimeString()`

Localised UTC time string, e.g. `"08:26:34 UTC"` / `"০৮:২৬:৩৪ UTC"`.

---

#### `toLocaleDateString(locales?, options?)`

```ts
toLocaleDateString(locales?: string | string[], options?: Intl.DateTimeFormatOptions): string
```

Localised date-only string powered by `Intl.DateTimeFormat`. Bangla calendar fields replace the Gregorian ones. The `timeZone` option must be `"UTC"` or omitted.

| Parameter | Default                           | Description                             |
| --------- | --------------------------------- | --------------------------------------- |
| `locales` | Instance language                 | BCP 47 locale (`"en-US"`, `"bn-BD"`, …) |
| `options` | `{ year, month, day: 'numeric' }` | `Intl.DateTimeFormatOptions`            |

```js
const d = new BanglaDate(new Date("2025-04-14"), "en");
d.toLocaleDateString("en-US"); // "4/14/1432"
d.toLocaleDateString("bn-BD", { month: "long" }); // "১৪ বৈশাখ ১৪৩২"
d.toLocaleDateString("hi-IN", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
}); // "सोमवार, बैशाख 14, 1432"
```

---

#### `toLocaleString(locales?, options?)`

Same as `toLocaleDateString` but defaults to including time components (`year`, `month`, `day`, `hour`, `minute`, `second`).

```js
d.toLocaleString("bn-BD"); // "১৪/৪/১৪৩২, ৬:০০:০০ AM"
```

---

#### `toLocaleTimeString(locales?, options?)`

Localised time-only string, e.g. `"6:00:00 AM"` / `"৬:০০:০০ AM"`.

---

#### `format(formatString)`

```ts
format(formatString: string): string
```

Formats the date using a token-based format string. All digits are automatically localised to the instance's language. Wrap literal text in `[...]` to prevent parsing as tokens.

See [Format Tokens](#format-tokens) for the full token list.

```js
const d = BanglaDate.fromBanglaDate(1432, 1, 5, "bn");
d.format("DD MMMM YYYY era"); // "০৫ বৈশাখ ১৪৩২ বঙ্গাব্দ"
d.format("WWWW, Do MMMM YYYY"); // "সোমবার, পহেলা বৈশাখ ১৪৩২"
d.format("[আজকের তারিখ:] DD/MM/YYYY"); // "আজকের তারিখ: ০৫/০১/১৪৩২"
d.format("HH:mm:ss AM/PM"); // "০৬:০০:০০ AM"
```

---

### Utility / Conversion

#### `toGregorian()`

Returns a defensive copy of the underlying Gregorian `Date` object.

```js
d.toGregorian() instanceof Date; // true
```

---

#### `toJSON()`

Returns a plain object for `JSON.stringify`:

```js
{
  year: 1432,
  month: 1,
  day: 5,
  era: 'BA',
  hours: 0,
  minutes: 0,
  seconds: 0,
  milliseconds: 0
}
```

---

#### `clone()`

Returns a new independent `BanglaDate` identical to this one (deep copy, same language).

---

#### `[Symbol.toPrimitive]`

Allows use in numeric and string contexts:

```js
+BanglaDate.today(); // Unix timestamp in ms (e.g. 1744329600000)
`${BanglaDate.today("bn")}`; // "২৪ ফাল্গুন ১৪৩২ বঙ্গাব্দ"
```

---

### Error Types

All errors extend `BanglaDateError` which itself extends `Error`.

| Class                  | Extends           | When thrown                                                                  |
| ---------------------- | ----------------- | ---------------------------------------------------------------------------- |
| `BanglaDateError`      | `Error`           | Base class — never thrown directly.                                          |
| `BanglaDateRangeError` | `BanglaDateError` | A numeric argument (year, month, day) is outside its valid range.            |
| `BanglaDateParseError` | `BanglaDateError` | A date string passed to `parse()` is malformed or has an unknown month name. |

```js
import {
  BanglaDate,
  BanglaDateParseError,
  BanglaDateRangeError,
} from "@subrotosaha/bangla-date";

try {
  BanglaDate.parse("bad input");
} catch (e) {
  if (e instanceof BanglaDateParseError) {
    console.error("Parse error:", e.message);
  }
}

try {
  BanglaDate.fromBanglaDate(1432, 13, 1); // month 13 does not exist
} catch (e) {
  if (e instanceof BanglaDateRangeError) {
    console.error("Range error:", e.message);
  }
}
```

---

## Format Tokens

Used with the `format(formatString)` method. All numeric output is automatically localised to the instance's language (`en` / `bn` / `hi`).

| Token   | en example  | bn example  | Description                                                  |
| ------- | ----------- | ----------- | ------------------------------------------------------------ |
| `YYYY`  | `1432`      | `১৪৩২`      | 4-digit Bangla year                                          |
| `YY`    | `32`        | `৩২`        | 2-digit Bangla year                                          |
| `MMMM`  | `Boishakh`  | `বৈশাখ`     | Full month name                                              |
| `MMM`   | `Boi`       | `বৈশা`      | Short month name                                             |
| `MM`    | `01`        | `০১`        | Zero-padded month number (01–12)                             |
| `M`     | `1`         | `১`         | Month number without padding (1–12)                          |
| `DD`    | `05`        | `০৫`        | Zero-padded day of month (01–31)                             |
| `D`     | `5`         | `৫`         | Day of month without padding (1–31)                          |
| `Do`    | `5th`       | `পহেলা`     | Ordinal day of month (language-aware)                        |
| `WWWW`  | `Sunday`    | `রবিবার`    | Full weekday name                                            |
| `WWW`   | `Sun`       | `রবি`       | Short weekday name                                           |
| `WW`    | `00`        | `০০`        | Zero-padded weekday index (00 = Sun … 06 = Sat)              |
| `W`     | `0`         | `০`         | Weekday index (0 = Sun … 6 = Sat)                            |
| `HH`    | `08`        | `০৮`        | Zero-padded 24-hour (00–23)                                  |
| `H`     | `8`         | `৮`         | 24-hour without padding (0–23)                               |
| `mm`    | `05`        | `০৫`        | Zero-padded minutes (00–59)                                  |
| `m`     | `5`         | `৫`         | Minutes without padding (0–59)                               |
| `ss`    | `09`        | `০৯`        | Zero-padded seconds (00–59)                                  |
| `s`     | `9`         | `৯`         | Seconds without padding (0–59)                               |
| `AM/PM` | `AM` / `PM` | `AM` / `PM` | Day period uppercase                                         |
| `era`   | `BA`        | `বঙ্গাব্দ`  | Era label in the instance's language                         |
| `[...]` | _(literal)_ | _(literal)_ | Escaped section — not parsed as tokens, digits not localised |

### Escape example

```js
d.format("[Day:] DD [of] MMMM, YYYY");
// English: "Day: 05 of Boishakh, 1432"
// Bengali: "Day: ০৫ of বৈশাখ, ১৪৩২"
```

> **Note:** `WW` is the weekday **index** (zero-padded), not an ISO week number.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for release history.

---

## License

[ISC](https://opensource.org/licenses/ISC) © subrotosaha
