# BanglaDate Class

The `BanglaDate` class provides functionality to work with the Bangla calendar system, including converting Gregorian dates to Bangla dates, formatting dates in multiple languages (English, Bengali, and Hindi), and retrieving various date components.

## Features

- Convert Gregorian dates to Bangla calendar dates.
- Support for multiple languages: English (`en`), Bengali (`bn`), and Hindi (`hi`).
- Retrieve date components such as year, month, day, hours, minutes, seconds, etc., in the specified language.
- Format dates using custom format strings.
- Localize dates using `Intl.DateTimeFormat` for proper internationalization.
- Handle leap years in the Bangla calendar.

## Example Usage

### Installation

```bash
npm install @subrotosaha/bangla-date
```

### Importing and Initializing

```javascript
import BanglaDate from "@subrotosaha/bangla-date";

const banglaDate = new BanglaDate(new Date(), "bn");
```

### Retrieving Date Components

```javascript
console.log(banglaDate.getYear()); // Example: ১৪৩১
console.log(banglaDate.getMonth()); // Example: ১২ (Bangla month index)
console.log(banglaDate.getDate()); // Example: ২৮ (Bangla day)
console.log(banglaDate.getDay()); // Example: ৪ (Day of the week)
console.log(banglaDate.getHours()); // Example: ২১ (Current hour)
console.log(banglaDate.getMinutes()); // Example: ১ (Current minutes)
console.log(banglaDate.getSeconds()); // Example: ৫৫ (Current seconds)
console.log(banglaDate.getMilliseconds()); // Example: ১৫৫ (Current milliseconds)
console.log(banglaDate.getTime()); // Example: ১৭৪৪২৯৭৩১৫১৫৫ (Timestamp in milliseconds)
console.log(banglaDate.getFullYear()); // Example: ২০২৫ (Gregorian year)
console.log(banglaDate.getTimezoneOffset()); // Example: -৩৬০ (Timezone offset in minutes)
console.log(banglaDate.getUTCDate()); // Example: ১০ (UTC day)
```

### Parsing and Formatting Dates

```javascript
console.log(banglaDate.parse("1 - 1 - 1400")); // Example: Parsed Gregorian date
console.log(banglaDate.format("YYYY-MM-DD")); // Example: ১৪৩১-১২-২৮ (Formatted date)
console.log(banglaDate.format("DD/MM/YYYY")); // Example: ২৮/১২/১৪৩১ (Formatted date)
console.log(banglaDate.format("MM-DD-YYYY")); // Example: ১২-২৮-১৪৩১ (Formatted date)
console.log(banglaDate.format("YYYY/MM/DD")); // Example: ১৪৩১/১২/২৮ (Formatted date)
console.log(banglaDate.format("DD/MM/YY")); // Example: ২৮/১২/৩১ (Formatted date)
```

### Localizing Dates

```javascript
console.log(banglaDate.toLocaleDateString("en-US")); // Example: 10/4/2025 (Localized date string)
console.log(banglaDate.toLocaleString("bn-BD")); // Example: ১৪৩১-১২-২৮ ২১:১:৫৫ (Localized string)
console.log(banglaDate.toLocaleDateString("hi-IN")); // Example: १४३२-६-१८ (Localized date string)
```
