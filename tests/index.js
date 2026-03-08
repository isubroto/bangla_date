import BanglaDate from "../dist/Date/index.js";


const banglaDate = new BanglaDate(new Date(), "bn");
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
console.log(BanglaDate.parse("1 Boishakh 1400")); // static: returns BanglaDate instance
console.log(banglaDate.format("YYYY-MM-DD")); // 1400-01-01 (Formatted date)
console.log(banglaDate.format("DD/MM/YYYY")); // 01/01/1400 (Formatted date)
console.log(banglaDate.format("MM-DD-YYYY W era")); // 01-01-1400 (Formatted date)
console.log(banglaDate.format("YYYY/MM/DD")); // 1400/01/01 (Formatted date)
console.log(banglaDate.format("YYYY MM DD")); // 1400 01 01 (Formatted date)
console.log(banglaDate.format("DD/MM/YY")); // 01/01/00 (Formatted date)
console.log(banglaDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Dhaka",
    timeZoneName: "short",
})); // 1-1-1400 (Locale date string)
console.log(banglaDate.toLocaleDateString("bn-BD", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Dhaka",
    timeZoneName: "short",
})); // 1-1-1400 (Locale sting)
console.log(banglaDate.toLocaleDateString("hi-IN", {
    year: "2-digit",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Dhaka",
    timeZoneName: "short",
})); // 12:00:00 AM (Locale time string)

banglaDate.toLocaleString("bn-BD", {
    year: "2-digit",
    month: "long",
    day: "numeric",
})