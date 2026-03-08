import BanglaDate from "../dist/Date/index.js";

// Static factory methods
const today = BanglaDate.today("bn");
console.log("today():", today.toString());
console.log("getEra():", today.getEra());
console.log("getRitu():", today.getRitu());
console.log("getDayOfYear():", today.getDayOfYear());
console.log("isValid():", today.isValid());
console.log("getFestival():", today.getFestival());

// fromBanglaDate
const newYear = BanglaDate.fromBanglaDate(1432, 1, 1, "en");
console.log("1 Boishakh 1432:", newYear.toString());
console.log("getFestival (Pohela Boishakh en):", newYear.getFestival());

// Arithmetic
const next = today.add(10);
console.log("add(10):", next.toString());
const prev = today.subtract(5);
console.log("subtract(5):", prev.toString());

// Diff
console.log("diff today vs newYear (days):", today.diff(newYear, "days"));
console.log("diff today vs newYear (months):", today.diff(newYear, "months"));
console.log("diff today vs newYear (years):", today.diff(newYear, "years"));

// Comparison
console.log("today.isAfter(newYear):", today.isAfter(newYear));
console.log("today.isBefore(newYear):", today.isBefore(newYear));
console.log("today.isSame(today):", today.isSame(BanglaDate.today("bn")));

// startOf / endOf
console.log("startOfMonth:", today.startOfMonth().toString());
console.log("endOfMonth:", today.endOfMonth().toString());
console.log("startOfYear:", today.startOfYear().toString());
console.log("endOfYear:", today.endOfYear().toString());
console.log("toDateString:", today.toDateString());

// relativeTime
const en3dAgo = new BanglaDate(new Date(), "en").subtract(3);
console.log("relativeTime (en, 3 days ago):", en3dAgo.relativeTime());
const bn2mFuture = new BanglaDate(new Date(), "bn").add(65);
console.log("relativeTime (bn, ~2 months future):", bn2mFuture.relativeTime());
const hiYearRelative = new BanglaDate(new Date(), "hi").add(400);
console.log("relativeTime (hi, ~1 year future):", hiYearRelative.relativeTime());

// isLeapYear and isValidBanglaDate (static)
console.log("isLeapYear(2028):", BanglaDate.isLeapYear(2028));
console.log("isValidBanglaDate(1432,1,31):", BanglaDate.isValidBanglaDate(1432, 1, 31));
console.log("isValidBanglaDate(1432,1,32):", BanglaDate.isValidBanglaDate(1432, 1, 32));
console.log("isValidBanglaDate(1432,13,1):", BanglaDate.isValidBanglaDate(1432, 13, 1));

// getFormatedMonthName now respects language
const hiDate = BanglaDate.today("hi");
console.log("format MMMM (hi):", hiDate.format("MMMM"));
const enDate = BanglaDate.today("en");
console.log("format MMMM (en):", enDate.format("MMMM"));

// numberToWords fixes (English hundreds)
import { numberToWords } from "../dist/utils/index.js";
console.log("numberToWords 200 en:", numberToWords(200, "en"));
console.log("numberToWords 350 en:", numberToWords(350, "en"));
console.log("numberToWords 200 bn:", numberToWords(200, "bn"));
console.log("numberToWords 200 hi:", numberToWords(200, "hi"));
console.log("numberToWords 150000 bn:", numberToWords(150000, "bn"));
console.log("numberToWords 1000000 en:", numberToWords(1000000, "en"));
