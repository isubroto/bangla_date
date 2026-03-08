import BanglaDate from '../dist/Date/index.js';
import { numberToWords, TIME_ZONE_OFFSETS } from '../dist/utils/index.js';

let pass = 0, fail = 0;
function check(label, cond, extra = '') {
    if (cond) { console.log('✓', label); pass++; }
    else { console.log('✗', label, extra); fail++; }
}

// ── 1. diff() sign-aware ──────────────────────────────────────────────────────
const d1 = BanglaDate.fromBanglaDate(1432, 1, 5);   // Boishakh 5
const d2 = BanglaDate.fromBanglaDate(1432, 1, 3);   // Boishakh 3 (before d1)
const d3 = BanglaDate.fromBanglaDate(1431, 12, 10); // Chaitra 10, year before
const d4 = BanglaDate.fromBanglaDate(1432, 2, 1);   // Jyoishtho 1
const d5 = BanglaDate.fromBanglaDate(1431, 1, 1);   // Boishakh 1, year before

check('diff months same-month fwd (5 vs 3)', d1.diff(d2, 'months') === 0, d1.diff(d2, 'months'));
check('diff months same-month bwd (3 vs 5)', d2.diff(d1, 'months') === 0, d2.diff(d1, 'months'));
check('diff years cross-year (1432B5 vs 1431Ch10)', d1.diff(d3, 'years') === 0, d1.diff(d3, 'years'));
check('diff years negative cross-year (1431Ch10 vs 1432B5)', d3.diff(d1, 'years') === 0, d3.diff(d1, 'years'));
check('diff years full year (1432Jo1 vs 1431B1)', d4.diff(d5, 'years') === 1, d4.diff(d5, 'years'));
// neg months: 1431 Ch10 → 1432 B5: 11 complete months back? no: 
//  (1431-1432)*12 + (11-0) = -12+11 = -1; d3.day(10)> d1.day(5) -> -1+1 = 0? 
// Actually: Ch is month index 11, B is index 0. months = (1431-1432)*12 + (11-0) = -12+11=-1
// months < 0 and d3.day(10) > d1.day(5) → months++ → 0
check('diff months 1431Ch10 vs 1432B5 = 0', d3.diff(d1, 'months') === 0, d3.diff(d1, 'months'));
// When d3.banglaDay < d1.banglaDay: 1431 Ch3 vs 1432 B5: months=-1, day(3)<day(5) → no adj → -1
const d3b = BanglaDate.fromBanglaDate(1431, 12, 3);
check('diff months 1431Ch3 vs 1432B5 = -1', d3b.diff(d1, 'months') === -1, d3b.diff(d1, 'months'));

// ── 2. Bengali 79 ─────────────────────────────────────────────────────────────
check('bn 79 = উনআশি', numberToWords(79, 'bn') === 'উনআশি', numberToWords(79, 'bn'));
check('bn 89 = উননব্বই (unchanged)', numberToWords(89, 'bn') === 'উননব্বই', numberToWords(89, 'bn'));

// ── 3. Hindi festivals no Bengali codepoints ─────────────────────────────────
const festHi = BanglaDate.fromBanglaDate(1432, 1, 1, 'hi').getFestival();
check('Hindi festival no Bengali (U+0980–U+09FF)', !/[\u0980-\u09ff]/.test(festHi), festHi);
const fest25Hi = BanglaDate.fromBanglaDate(1432, 1, 25, 'hi').getFestival();
check('Hindi Rabindra no Bengali', !/[\u0980-\u09ff]/.test(fest25Hi), fest25Hi);

// ── 5. relativeTime 0-months fallback ────────────────────────────────────────
// A date exactly 30 days ago that sits in the same Bangla month should fall
// back to "days" (not "0 months").  We test with a known same-month date.
const today = BanglaDate.today();
const sameMonthDate = today.subtract(today.getDate() - 1, 'days'); // beginning of this month
const rtSameMonth = sameMonthDate.relativeTime();
check('relativeTime same-month start not "0 months"',
    rtSameMonth !== '0 months ago', rtSameMonth);

// ── 6. English "one hundred" ─────────────────────────────────────────────────
check('en 100 = "one hundred"', numberToWords(100, 'en') === 'one hundred', numberToWords(100, 'en'));
check('en 150 = "one hundred fifty"', numberToWords(150, 'en') === 'one hundred fifty', numberToWords(150, 'en'));
check('en 200 = "two hundred"', numberToWords(200, 'en') === 'two hundred', numberToWords(200, 'en'));
check('en 999 = "nine hundred ninety-nine"', numberToWords(999, 'en') === 'nine hundred ninety-nine', numberToWords(999, 'en'));

// ── 7. format() escape [...] ─────────────────────────────────────────────────
const dt = BanglaDate.fromBanglaDate(1432, 1, 15, 'en');
check('format [literal] not expanded', dt.format('[Today is] YYYY-MM-DD') === 'Today is 1432-01-15', dt.format('[Today is] YYYY-MM-DD'));
check('format [MM DD YYYY] fully literal', dt.format('[MM DD YYYY]') === 'MM DD YYYY', dt.format('[MM DD YYYY]'));
check('format mixed escape+token', dt.format('YYYY [বঙ্গাব্দ]') === '1432 বঙ্গাব্দ', dt.format('YYYY [বঙ্গাব্দ]'));
// bn locale: content inside [...] must survive digit localisation verbatim
const dtBn = BanglaDate.fromBanglaDate(1432, 1, 15, 'bn');
const bnEscaped = dtBn.format('[YYYY] MM DD');
check('format bn: [YYYY] appears literally', bnEscaped.includes('YYYY'), bnEscaped);
check('format bn: MM/DD still localised', bnEscaped.includes('০১') && bnEscaped.includes('১৫'), bnEscaped);

// ── 9. TIME_ZONE_OFFSETS exported ────────────────────────────────────────────
check('TIME_ZONE_OFFSETS is object', typeof TIME_ZONE_OFFSETS === 'object');
check('TIME_ZONE_OFFSETS.IST = 5.5', TIME_ZONE_OFFSETS.IST === 5.5, TIME_ZONE_OFFSETS.IST);
check('TIME_ZONE_OFFSETS.BST = 6', TIME_ZONE_OFFSETS.BST === 6, TIME_ZONE_OFFSETS.BST);
check('TIME_ZONE_OFFSETS.LINT = 14', TIME_ZONE_OFFSETS.LINT === 14, TIME_ZONE_OFFSETS.LINT);
check('TIME_ZONE_OFFSETS has 100+ entries', Object.keys(TIME_ZONE_OFFSETS).length >= 100);

// ── 10. Template-aware _applyLocale ──────────────────────────────────────────
// A date whose toLocaleDateString should swap year/month/day with Bangla values
const samp = BanglaDate.fromBanglaDate(1432, 5, 20, 'bn'); // Bhadro 20
const loc = samp.toLocaleDateString('bn', { year: 'numeric', month: 'numeric', day: 'numeric' });
// Bangla year 1432+593=2025 Gregorian, but output should show Bangla year 1432
check('toLocaleDateString contains Bangla year ১৪৩২', loc.includes('১৪৩২'), loc);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
