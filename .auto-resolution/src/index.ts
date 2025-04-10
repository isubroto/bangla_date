import BanglaDate from "./Date/Date.js";

const banglaDate=new BanglaDate(new Date(), "bn");
console.log(banglaDate);
console.log(banglaDate.getYear()); // 1400
console.log(banglaDate.getMonth()); // 1 (January in Bangla calendar)
console.log(banglaDate.getDate()); // 1-1-1400
console.log(banglaDate.getDay()); // 0 (Sunday)
console.log(banglaDate.getHours()); // Current hour
console.log(banglaDate.getMinutes()); // Current minutes
console.log(banglaDate.getSeconds()); // Current seconds
console.log(banglaDate.getMilliseconds()); // Current milliseconds
console.log(banglaDate.getTime()); // Current timestamp in milliseconds
console.log(banglaDate.getFullYear()); // 2023 (Gregorian year)
console.log(banglaDate.getDate()); // 1 (Bangla date)
console.log(banglaDate.getTimezoneOffset()); // Timezone offset in minutes
console.log(banglaDate.getUTCDate()); // 1 (UTC date)
console.log(banglaDate.parse("1 - 1 - 1400")); // 1-1-1400 (Parsed date)
console.log(banglaDate.format("YYYY-MM-DD")); // 1400-01-01 (Formatted date)
console.log(banglaDate.format("DD/MM/YYYY")); // 01/01/1400 (Formatted date)
console.log(banglaDate.format("MM-DD-YYYY")); // 01-01-1400 (Formatted date)
console.log(banglaDate.format("YYYY/MM/DD")); // 1400/01/01 (Formatted date)
console.log(banglaDate.format("YYYY MM DD")); // 1400 01 01 (Formatted date)
console.log(banglaDate.format("DD/MM/YY")); // 01/01/00 (Formatted date)
console.log(banglaDate.format("YYYY/YY-MMMM=MMM--MM&M#@HH-H-mm)(m*ss-is AM/PM"));
// 1400/00-জানুয়ারী=জানু--01&ম#@00-হ-00)(00*00-এএম/পিএম (Formatted date)
console.log(banglaDate.toLocaleDateString("en-US")); // 1-1-1400 (Locale date string)
console.log(banglaDate.toLocaleString("bn-BD")); // 1-1-1400 (Locale sting)
console.log(banglaDate.toLocaleDateString("hi-IN")); // 12:00:00 AM (Locale time string)