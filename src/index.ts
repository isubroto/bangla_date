import BanglaDate from "./Date/Date.js";

const banglaDate=new BanglaDate(new Date(), "bn");
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