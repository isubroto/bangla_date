import { DateKit } from "@subrotosaha/datekit";
import { numberToNumber } from "../utils/index.js";

type Language = "en" | "bn" | "hi";

// ── Custom error hierarchy ────────────────────────────────────────────────────

/**
 * Base error class for all BanglaDate failures.
 *
 * Extend this class (or catch it) to handle any error thrown by the library.
 * All more-specific error types (`BanglaDateRangeError`, `BanglaDateParseError`)
 * inherit from this class, so a single `catch (e)` block can test
 * `e instanceof BanglaDateError` to distinguish library errors from unrelated ones.
 *
 * @example
 * try {
 *   BanglaDate.parse('invalid');
 * } catch (e) {
 *   if (e instanceof BanglaDateError) console.error('Library error:', e.message);
 * }
 */
export class BanglaDateError extends Error {
  /**
   * @param message - Human-readable description of what went wrong.
   */
  constructor(message: string) {
    super(message);
    this.name = "BanglaDateError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when a numeric argument (year, month, or day) falls outside its
 * valid range.
 *
 * Common triggers:
 * - Month not in 1–12 in `fromBanglaDate()` or `parse()`.
 * - Day exceeding the maximum for the given month (e.g. day 32, or day 31 in
 *   a 30-day month such as Ashwin).
 *
 * @example
 * try {
 *   BanglaDate.fromBanglaDate(1432, 13, 1); // month 13 doesn't exist
 * } catch (e) {
 *   if (e instanceof BanglaDateRangeError) console.error(e.message);
 *   // "Month must be between 1 and 12, got 13."
 * }
 */
export class BanglaDateRangeError extends BanglaDateError {
  /**
   * @param message - Human-readable description of what value was out of range.
   */
  constructor(message: string) {
    super(message);
    this.name = "BanglaDateRangeError";
  }
}

/**
 * Thrown when a date string passed to `BanglaDate.parse()` cannot be
 * interpreted as a valid Bangla date.
 *
 * Common triggers:
 * - The string does not follow the required `"DD MonthName YYYY"` format.
 * - The month name is not one of the 12 recognised English Bangla month names.
 * - The day or year tokens are not valid integers.
 *
 * @example
 * try {
 *   BanglaDate.parse('2025-04-14'); // wrong format
 * } catch (e) {
 *   if (e instanceof BanglaDateParseError) console.error(e.message);
 *   // 'Expected "DD MonthName YYYY" (e.g. "15 Boishakh 1432").'
 * }
 */
export class BanglaDateParseError extends BanglaDateError {
  /**
   * @param message - Human-readable description of why parsing failed.
   */
  constructor(message: string) {
    super(message);
    this.name = "BanglaDateParseError";
  }
}

// ─────────────────────────────────────────────────────────────────────────────

class BanglaDate {
  private banglaYear: number;
  private banglaMonthIndex: number;
  private banglaDay: number;
  private gregorianDate: Date;
  private language: Language;

  /**
   * Creates a `BanglaDate` instance from a Gregorian `Date` object.
   *
   * The constructor converts the supplied Gregorian date to the corresponding
   * Bangla calendar date following the **revised Bangladesh National Calendar**
   * (established by the 1966 Reform Committee).
   *
   * - Pohela Boishakh (1 Boishakh) is fixed to **April 14 UTC** every year.
   * - All date arithmetic is performed in **UTC** to avoid host-timezone drift.
   * - Months 1–5 (Boishakh–Bhadra) contain 31 days; months 6–10 (Ashwin–Magh)
   *   contain 30 days; month 11 (Falgun) has 29 days in a common year and 30
   *   days in a Bangla leap year (when the following Gregorian year is a leap year);
   *   month 12 (Chaitra) always contains 30 days.
   *
   * @param gregorianDate - Any valid JavaScript `Date` object. Time-of-day
   *   components are preserved so that arithmetic and formatting methods can
   *   access the full timestamp.
   * @param language - Output language for all text-returning methods.
   *   - `"en"` (default) — English (Latin digits, English month/weekday names)
   *   - `"bn"` — Bengali (Bengali digits ০–৯, Bengali names)
   *   - `"hi"` — Hindi (Devanagari digits ०–९, Hindi names)
   *
   * @example
   * // English (default)
   * const d = new BanglaDate(new Date('2025-04-14'), 'en');
   * d.toString(); // "1 Boishakh 1432 BA"
   *
   * @example
   * // Bengali output
   * const d = new BanglaDate(new Date('2025-04-14'), 'bn');
   * d.toString(); // "১ বৈশাখ ১৪৩২ বঙ্গাব্দ"
   */
  constructor(gregorianDate: Date, language: Language = "en") {
    this.language = language;
    // Normalise to UTC midnight of the local calendar date so that strings like
    // "Feb 24, 2026" or "Tue Feb 24 2026 06:00:00 GMT+0600" always produce
    // 2026-02-24T00:00:00.000Z regardless of the host timezone.
    const formatted = DateKit.formatFromTimezoneString(
      gregorianDate,
      "YYYY-MM-DD"
    );
    this.gregorianDate = new Date(`${formatted}T00:00:00+00:00`);
    const gYear = this.gregorianDate.getUTCFullYear();
    // Pohela Boishakh is fixed at April 14 UTC in the revised Bangladesh calendar
    const pohelaBoishakh = new Date(Date.UTC(gYear, 3, 14));
    const isBeforePohelaBoishakh =
      this.gregorianDate.getTime() < pohelaBoishakh.getTime();
    this.banglaYear = (isBeforePohelaBoishakh ? gYear - 1 : gYear) - 593;

    const refYear = isBeforePohelaBoishakh ? gYear - 1 : gYear;
    const refDate = new Date(Date.UTC(refYear, 3, 14));
    const dayDiff = Math.floor(
      (this.gregorianDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // FIX: use shared helper so leap-year logic is consistent across constructor and parse()
    const monthLengths = BanglaDate.getMonthLengths(refYear);

    let remainingDays = dayDiff;
    let monthIndex = 0;
    // FIX: iterate only up to index 11 inside the loop to prevent overflow;
    // the final month absorbs any leftover days (should never exceed 30).
    while (monthIndex < 11 && remainingDays >= monthLengths[monthIndex]) {
      remainingDays -= monthLengths[monthIndex];
      monthIndex++;
    }

    this.banglaMonthIndex = monthIndex;
    this.banglaDay = remainingDays + 1;
  }

  // ── Static entry-points ─────────────────────────────────────────────────

  /**
   * Creates a `BanglaDate` for the **current moment**, preserving the
   * full time-of-day component of the underlying timestamp.
   *
   * This is the live equivalent of `new BanglaDate(new Date())`. Use it
   * when you need hour/minute/second precision (e.g. in a clock, log
   * timestamp, or countdown). If you only need the date portion (no time),
   * prefer `today()` which normalises to midnight UTC.
   *
   * @param language - Output language for all text-returning methods.
   *   - `"en"` (default) — English
   *   - `"bn"` — Bengali
   *   - `"hi"` — Hindi
   * @returns A new `BanglaDate` representing the current instant.
   *
   * @example
   * const d = BanglaDate.now('bn');
   * d.format('DD MMMM YYYY HH:mm:ss'); // e.g. "২৪ ফাল্গুন ১৪৩২ ১৪:৩০:০৫"
   */
  static now(language: Language = "en"): BanglaDate {
    return new BanglaDate(new Date(), language);
  }

  /**
   * Parses a Bangla date string in the **`"DD MonthName YYYY"`** format and
   * returns a new `BanglaDate` instance set to midnight UTC on that date.
   *
   * Parsing rules:
   * - The three tokens must be separated by one or more whitespace characters.
   * - `DD` — a positive integer day of month (e.g. `"1"` or `"15"`).
   * - `MonthName` — one of the 12 English Bangla month names, case-insensitive
   *   (e.g. `"Boishakh"`, `"boishakh"`, `"BOISHAKH"`).
   * - `YYYY` — a positive integer Bangla year (e.g. `"1432"`).
   *
   * Valid month names (case-insensitive):
   * `Boishakh`, `Jyoishtho`, `Asharh`, `Shrabon`, `Bhadro`, `Ashwin`,
   * `Kartik`, `Ogrohayon`, `Poush`, `Magh`, `Falgun`, `Chaitra`.
   *
   * @param dateString - A date string in `"DD MonthName YYYY"` format.
   * @param language - Language for the returned instance's text output.
   *   Defaults to `"en"`.
   * @returns A new `BanglaDate` at midnight UTC on the parsed Bangla date.
   * @throws {BanglaDateParseError} When the string does not have exactly three
   *   whitespace-separated tokens, the month name is unrecognised, or the day
   *   or year tokens are not valid positive integers.
   * @throws {BanglaDateRangeError} When the day exceeds the maximum for the
   *   given month (e.g. `"32 Boishakh 1432"` or `"31 Ashwin 1432"`).
   *
   * @example
   * BanglaDate.parse('15 Boishakh 1432').toString();
   * // "15 Boishakh 1432 BA"
   *
   * BanglaDate.parse('1 chaitra 1432', 'bn').toString();
   * // "১ চৈত্র ১৪৩২ বঙ্গাব্দ"
   */
  static parse(dateString: string, language: Language = "en"): BanglaDate {
    const parts = dateString.trim().split(/\s+/);
    if (parts.length !== 3) {
      throw new BanglaDateParseError(
        'Expected "DD MonthName YYYY" (e.g. "15 Boishakh 1432").'
      );
    }
    const [day, monthName, yearWithBS] = parts;

    const banglaMonthNames: Record<string, number> = {
      Boishakh: 0,
      Jyoishtho: 1,
      Asharh: 2,
      Shrabon: 3,
      Bhadro: 4,
      Ashwin: 5,
      Kartik: 6,
      Ogrohayon: 7,
      Poush: 8,
      Magh: 9,
      Falgun: 10,
      Chaitra: 11,
    };

    const normalised =
      monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
    const monthIndex = banglaMonthNames[normalised];
    if (monthIndex === undefined) {
      throw new BanglaDateParseError(
        `Unknown month name: "${monthName}". Valid: ${Object.keys(
          banglaMonthNames
        ).join(", ")}`
      );
    }
    const dayOfMonth = parseInt(day, 10);
    if (isNaN(dayOfMonth) || dayOfMonth < 1) {
      throw new BanglaDateParseError(`Invalid day: "${day}".`);
    }
    const yearInBS = parseInt(yearWithBS, 10);
    if (isNaN(yearInBS) || yearInBS < 1) {
      throw new BanglaDateParseError(`Invalid Bangla year: "${yearWithBS}".`);
    }

    const gregorianYear = yearInBS + 593;
    const monthLengths = BanglaDate.getMonthLengths(gregorianYear);
    if (dayOfMonth > monthLengths[monthIndex]) {
      throw new BanglaDateRangeError(
        `Day ${dayOfMonth} out of range for ${monthName} ${yearInBS} (max ${monthLengths[monthIndex]}).`
      );
    }

    const pohelaBoishakh = new Date(Date.UTC(gregorianYear, 3, 14));
    let dayOffset = 0;
    for (let i = 0; i < monthIndex; i++) dayOffset += monthLengths[i];
    dayOffset += dayOfMonth - 1;
    const gDate = new Date(pohelaBoishakh.getTime() + dayOffset * 86_400_000);
    return new BanglaDate(gDate, language);
  }

  /**
   * Returns `true` when the given **Gregorian** year is a leap year.
   *
   * Uses the standard proleptic Gregorian rule:
   * - Divisible by 4 → leap, **except** centuries (÷100) which are
   *   only leap if also divisible by 400.
   *
   * > **Note:** Pass the Gregorian reference year, *not* the Bangla year.
   * > Bangla leap-year determination (see `getMonthLengths`) tests the year
   * > *following* the reference year because Falgun (month 11) falls in
   * > mid-February to mid-March of that next Gregorian year.
   *
   * @param year - A full Gregorian year (e.g. `2024`).
   * @returns `true` if `year` is a Gregorian leap year, `false` otherwise.
   *
   * @example
   * BanglaDate.isLeapYear(2024); // true
   * BanglaDate.isLeapYear(1900); // false (century, not ÷400)
   * BanglaDate.isLeapYear(2000); // true  (divisible by 400)
   */
  static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  /**
   * Returns a 12-element array of day-counts for the Bangla year whose
   * **Pohela Boishakh** (1 Boishakh) falls on April 14 of `gregorianRefYear`.
   *
   * Per the Bangladesh National Calendar:
   * - Months 1–5  (Boishakh–Bhadra)  → **31 days** each  = 155
   * - Months 6–10 (Ashwin–Magh)      → **30 days** each  = 150
   * - Month 11   (Falgun)            → 29 days (common) or 30 (Bangla leap year)
   * - Month 12   (Chaitra)           → **30 days** always
   *
   * **Leap year rule:** The Bangla year straddles two Gregorian years.
   * Falgun (month 11) falls in mid-February to mid-March of
   * `gregorianRefYear + 1`, so the leap-year test is applied to
   * `gregorianRefYear + 1`, not `gregorianRefYear` itself.
   *
   * Totals: 364 (common) / 365 (leap).
   *
   * @param gregorianRefYear - The Gregorian year in which Pohela Boishakh
   *   (April 14) of the target Bangla year falls (e.g. pass `2025` for
   *   Bangla year 1432).
   * @returns An array `[31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29|30, 30]`
   *   indexed 0 (Boishakh) through 11 (Chaitra).
   *
   * @example
   * BanglaDate.getMonthLengths(2024);
   * // [31,31,31,31,31,30,30,30,30,30,30,30]  — 2025 is leap → Falgun=30
   *
   * BanglaDate.getMonthLengths(2025);
   * // [31,31,31,31,31,30,30,30,30,30,29,30]  — 2026 is not leap → Falgun=29
   */
  static getMonthLengths(gregorianRefYear: number): number[] {
    const isLeap = BanglaDate.isLeapYear(gregorianRefYear + 1);
    return [
      31,
      31,
      31,
      31,
      31, // Boishakh–Bhadra  = 155
      30,
      30,
      30,
      30,
      30, // Ashwin–Magh      = 150
      isLeap ? 30 : 29, // Falgun           = 29 or 30
      30, // Chaitra          = 30
    ];
  }

  // ── Factory Methods ──────────────────────────────────────────────────────

  /**
   * Creates a `BanglaDate` at **midnight UTC** for today's date.
   *
   * Time components are zeroed (`00:00:00.000 UTC`), making this suitable
   * for date-only comparisons, calendar rendering, and any use case where
   * the time of day is irrelevant. For the current instant with time
   * preserved, use `now()` instead.
   *
   * @param language - Output language for all text-returning methods.
   *   - `"en"` (default) — English
   *   - `"bn"` — Bengali
   *   - `"hi"` — Hindi
   * @returns A new `BanglaDate` representing today at `00:00:00.000 UTC`.
   *
   * @example
   * BanglaDate.today('en').toString();
   * // e.g. "24 Falgun 1432 BA"
   *
   * BanglaDate.today('bn').format('WWWW, DD MMMM YYYY');
   * // e.g. "রবিবার, ২৪ ফাল্গুন ১৪৩২"
   */
  static today(language: Language = "en"): BanglaDate {
    const d = new Date();
    return new BanglaDate(
      new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())),
      language
    );
  }

  /**
   * Creates a `BanglaDate` from explicit Bangla calendar components, set to
   * midnight UTC on that date.
   *
   * This is the primary factory for constructing a `BanglaDate` when you
   * already know the Bangla year, month, and day (e.g. from user input or
   * a stored Bangla date string). Internally it converts the components to a
   * Gregorian timestamp by offsetting from Pohela Boishakh (April 14 UTC).
   *
   * @param year - Full Bangla year (e.g. `1432`). Any positive integer.
   * @param month - 1-indexed Bangla month number:
   *   `1`=Boishakh, `2`=Jyoishtho, `3`=Asharh, `4`=Shrabon, `5`=Bhadro,
   *   `6`=Ashwin, `7`=Kartik, `8`=Ogrohayon, `9`=Poush, `10`=Magh,
   *   `11`=Falgun, `12`=Chaitra.
   * @param day - Day of the month (1-based). Must not exceed the length of
   *   the given month in the given year (see `getMonthLengths`).
   * @param language - Output language for all text-returning methods.
   *   Defaults to `"en"`.
   * @returns A new `BanglaDate` at midnight UTC on the specified Bangla date.
   * @throws {BanglaDateRangeError} If `month` is not 1–12, `day` is less than
   *   1, or `day` exceeds the maximum day count for the given month.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 1, 'en').toString();
   * // "1 Boishakh 1432 BA"  (= 2025-04-14 UTC)
   *
   * BanglaDate.fromBanglaDate(1432, 12, 30, 'bn').toString();
   * // "৩০ চৈত্র ১৪৩২ বঙ্গাব্দ"
   */
  static fromBanglaDate(
    year: number,
    month: number,
    day: number,
    language: Language = "en"
  ): BanglaDate {
    if (month < 1 || month > 12) {
      throw new BanglaDateRangeError(
        `Month must be between 1 and 12, got ${month}.`
      );
    }
    if (day < 1) {
      throw new BanglaDateRangeError(`Day must be at least 1, got ${day}.`);
    }
    const gregorianYear = year + 593;
    const monthLengths = BanglaDate.getMonthLengths(gregorianYear);
    const maxDay = monthLengths[month - 1];
    if (day > maxDay) {
      throw new BanglaDateRangeError(
        `Day ${day} exceeds the ${maxDay}-day length of month ${month}.`
      );
    }
    const pohelaBoishakh = new Date(Date.UTC(gregorianYear, 3, 14));
    let dayOffset = 0;
    for (let i = 0; i < month - 1; i++) {
      dayOffset += monthLengths[i];
    }
    dayOffset += day - 1;
    const gDate = new Date(pohelaBoishakh.getTime() + dayOffset * 86_400_000);
    return new BanglaDate(gDate, language);
  }

  /**
   * Returns `true` when the given Bangla calendar components form a valid date.
   *
   * Validation checks (all must pass):
   * 1. `year`, `month`, and `day` must all be integers
   *    (`Number.isInteger` is `true`).
   * 2. `month` must be in the range 1–12.
   * 3. `day` must be at least 1.
   * 4. `day` must not exceed the maximum day count for `month` in `year`
   *    (accounts for Bangla leap years where Chaitra = 31 days).
   *
   * This is a pure validation helper — it does **not** create a `BanglaDate`
   * instance. Use it to guard user input before calling `fromBanglaDate()`.
   *
   * @param year - Bangla year to validate (e.g. `1432`).
   * @param month - 1-indexed Bangla month (1 = Boishakh … 12 = Chaitra).
   * @param day - Day of the month.
   * @returns `true` if the combination is a valid Bangla date, `false` otherwise.
   *
   * @example
   * BanglaDate.isValidBanglaDate(1432, 1, 31);  // true  (Boishakh has 31 days)
   * BanglaDate.isValidBanglaDate(1432, 6, 31);  // false (Ashwin has only 30 days)
   * BanglaDate.isValidBanglaDate(1432, 0, 1);   // false (month 0 is invalid)
   * BanglaDate.isValidBanglaDate(1432, 1, 1.5); // false (day is not an integer)
   */
  static isValidBanglaDate(year: number, month: number, day: number): boolean {
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day)
    )
      return false;
    if (month < 1 || month > 12 || day < 1) return false;
    const monthLengths = BanglaDate.getMonthLengths(year + 593);
    return day <= monthLengths[month - 1];
  }

  // ── Validity ─────────────────────────────────────────────────────────────

  /**
   * Returns `true` when this instance represents a valid Bangla date.
   *
   * An instance can be invalid if:
   * - The underlying Gregorian `Date` has an invalid timestamp (`NaN`).
   * - The computed Bangla month index is outside 0–11 (should not occur
   *   under normal construction, but may arise from manual manipulation).
   * - The computed Bangla day is less than 1 or greater than the maximum
   *   day count for the month (e.g. > 30 for Ashwin, or > 30/31 for Chaitra).
   *
   * @returns `true` if this date is valid, `false` otherwise.
   *
   * @example
   * new BanglaDate(new Date('invalid')).isValid();           // false
   * BanglaDate.fromBanglaDate(1432, 1, 15).isValid();       // true
   */
  isValid(): boolean {
    if (isNaN(this.gregorianDate.getTime())) return false;
    if (this.banglaMonthIndex < 0 || this.banglaMonthIndex > 11) return false;
    const maxDay = BanglaDate.getMonthLengths(this.banglaYear + 593)[
      this.banglaMonthIndex
    ];
    return this.banglaDay >= 1 && this.banglaDay <= maxDay;
  }

  // ── Comparison Methods ───────────────────────────────────────────────────

  /**
   * Returns `true` when this date is **strictly before** `other`.
   *
   * Comparison is performed on the underlying millisecond timestamps
   * (UTC), so time-of-day is taken into account. If you want a
   * date-only comparison, call `isBefore` on `today()`-normalised
   * instances, or use `isSame`/`diff` with `granularity: 'day'`.
   *
   * @param other - The `BanglaDate` to compare against.
   * @returns `true` if `this` is earlier than `other`, `false` otherwise
   *   (including when they are equal).
   *
   * @example
   * const a = BanglaDate.fromBanglaDate(1432, 1, 1);
   * const b = BanglaDate.fromBanglaDate(1432, 6, 1);
   * a.isBefore(b); // true
   * b.isBefore(a); // false
   * a.isBefore(a); // false (equal, not strictly before)
   */
  isBefore(other: BanglaDate): boolean {
    return this.gregorianDate.getTime() < other.gregorianDate.getTime();
  }

  /**
   * Returns `true` when this date is **strictly after** `other`.
   *
   * Comparison is performed on the underlying millisecond timestamps
   * (UTC), so time-of-day is taken into account.
   *
   * @param other - The `BanglaDate` to compare against.
   * @returns `true` if `this` is later than `other`, `false` otherwise
   *   (including when they are equal).
   *
   * @example
   * const a = BanglaDate.fromBanglaDate(1432, 1, 1);
   * const b = BanglaDate.fromBanglaDate(1432, 6, 1);
   * b.isAfter(a); // true
   * a.isAfter(b); // false
   * a.isAfter(a); // false (equal, not strictly after)
   */
  isAfter(other: BanglaDate): boolean {
    return this.gregorianDate.getTime() > other.gregorianDate.getTime();
  }

  /**
   * Returns `true` when this date and `other` are equal at the given
   * granularity level.
   *
   * - `"year"`  — only the Bangla year must match.
   * - `"month"` — both the Bangla year **and** month index must match.
   * - `"day"`   — year, month, **and** day must all match (default).
   *
   * Note: the comparison is on Bangla calendar fields, not on raw timestamps.
   * Two instances created from different times on the same Bangla calendar day
   * will still return `true` for `isSame(other, 'day')`.
   *
   * @param other - The `BanglaDate` to compare against.
   * @param granularity - How precisely to compare. Defaults to `'day'`.
   * @returns `true` if the dates are equal at the specified granularity.
   *
   * @example
   * const a = BanglaDate.fromBanglaDate(1432, 3, 10);
   * const b = BanglaDate.fromBanglaDate(1432, 3, 25);
   * const c = BanglaDate.fromBanglaDate(1433, 3, 10);
   *
   * a.isSame(b, 'year');  // true  (same year 1432)
   * a.isSame(b, 'month'); // true  (same year + month)
   * a.isSame(b, 'day');   // false (different days)
   * a.isSame(c, 'year');  // false (different years)
   */
  isSame(
    other: BanglaDate,
    granularity: "day" | "month" | "year" = "day"
  ): boolean {
    if (granularity === "year") return this.banglaYear === other.banglaYear;
    if (granularity === "month")
      return (
        this.banglaYear === other.banglaYear &&
        this.banglaMonthIndex === other.banglaMonthIndex
      );
    return (
      this.banglaYear === other.banglaYear &&
      this.banglaMonthIndex === other.banglaMonthIndex &&
      this.banglaDay === other.banglaDay
    );
  }

  // ── Arithmetic Methods ───────────────────────────────────────────────────

  /**
   * Returns a **new** `BanglaDate` shifted forward by `amount` of the given
   * `unit`. This instance is **not** mutated (immutable operation).
   *
   * Pass a negative `amount` to shift into the past. Alternatively use
   * `subtract()` for a more readable API.
   *
   * **Day addition** is exact: it simply adds `amount × 86 400 000 ms` to
   * the underlying timestamp, so the time-of-day is always preserved.
   *
   * **Month / year addition** computes the new Bangla calendar position and
   * then re-applies the original time-of-day offset. When the current day
   * exceeds the maximum day count of the target month, it is **clamped** to
   * that month's last day (e.g. 31 Boishakh + 5 months = 30 Ashwin, because
   * Ashwin has only 30 days).
   *
   * @param amount - Number of units to add. Negative values subtract.
   * @param unit - Unit of addition. Defaults to `"days"`.
   *   - `"days"`   — calendar days (exact millisecond arithmetic)
   *   - `"months"` — Bangla calendar months; handles year roll-over automatically
   *   - `"years"`  — Bangla calendar years
   * @returns A new `BanglaDate` shifted by the specified amount.
   *
   * @example
   * const d = BanglaDate.fromBanglaDate(1432, 1, 15);
   * d.add(10, 'days').toString();   // "25 Boishakh 1432 BA"
   * d.add(2, 'months').toString();  // "15 Asharh 1432 BA"
   * d.add(1, 'years').toString();   // "15 Boishakh 1433 BA"
   * d.add(-3, 'days').toString();   // "12 Boishakh 1432 BA"
   */
  add(amount: number, unit: "days" | "months" | "years" = "days"): BanglaDate {
    if (unit === "days") {
      return new BanglaDate(
        new Date(this.gregorianDate.getTime() + amount * 86_400_000),
        this.language
      );
    }
    // For months/years: compute the new date-only position via fromBanglaDate,
    // then re-apply the original time-of-day so it is preserved.
    let newYear: number;
    let newMonthIndex: number;
    if (unit === "months") {
      newMonthIndex = this.banglaMonthIndex + amount;
      newYear = this.banglaYear + Math.floor(newMonthIndex / 12);
      newMonthIndex = ((newMonthIndex % 12) + 12) % 12;
    } else {
      newYear = this.banglaYear + amount;
      newMonthIndex = this.banglaMonthIndex;
    }
    const maxDay = BanglaDate.getMonthLengths(newYear + 593)[newMonthIndex];
    const dateMidnight = BanglaDate.fromBanglaDate(
      newYear,
      newMonthIndex + 1,
      Math.min(this.banglaDay, maxDay),
      this.language
    );
    // Time-of-day offset in ms from the start of the UTC day
    const timeOfDay =
      this.gregorianDate.getTime() -
      Date.UTC(
        this.gregorianDate.getUTCFullYear(),
        this.gregorianDate.getUTCMonth(),
        this.gregorianDate.getUTCDate()
      );
    return new BanglaDate(
      new Date(dateMidnight.gregorianDate.getTime() + timeOfDay),
      this.language
    );
  }

  /**
   * Returns a **new** `BanglaDate` shifted **backward** by `amount` of the
   * given `unit`. This instance is **not** mutated.
   *
   * This is a convenience alias for `add(-amount, unit)`. All behaviour
   * (day clamping, time-of-day preservation, year roll-over) is identical
   * to `add()`.
   *
   * @param amount - Number of units to subtract (positive number = go back).
   * @param unit - Unit of subtraction. Defaults to `"days"`.
   *   - `"days"`   — calendar days
   *   - `"months"` — Bangla calendar months
   *   - `"years"`  — Bangla calendar years
   * @returns A new `BanglaDate` shifted backward by the specified amount.
   *
   * @example
   * const d = BanglaDate.fromBanglaDate(1432, 6, 15);
   * d.subtract(1, 'months').toString();  // "15 Bhadro 1432 BA"
   * d.subtract(7, 'days').toString();    // "8 Ashwin 1432 BA"
   * d.subtract(1, 'years').toString();   // "15 Ashwin 1431 BA"
   */
  subtract(
    amount: number,
    unit: "days" | "months" | "years" = "days"
  ): BanglaDate {
    return this.add(-amount, unit);
  }

  /**
   * Calculates the **signed** difference between this date and `other`.
   *
   * - A **positive** result means `this` is **after** `other`.
   * - A **negative** result means `this` is **before** `other`.
   * - Zero means the dates are equal at the requested unit.
   *
   * **`"days"`** — divides the raw millisecond difference by 86 400 000 and
   * floors the result, so partial days are truncated.
   *
   * **`"months"`** — counts completed Bangla calendar months. The result is
   * adjusted so that a partial trailing month is not counted (e.g. Jan 31 →
   * Feb 28 = 0 full months, not 1).
   *
   * **`"years"`** — counts completed Bangla calendar years, using the
   * month and day to decide whether the anniversary has been passed.
   *
   * @param other - The reference `BanglaDate` to subtract from `this`.
   * @param unit - Unit for the result. Defaults to `"days"`.
   * @returns Signed integer difference in the requested unit.
   *
   * @example
   * const start = BanglaDate.fromBanglaDate(1432, 1, 1);
   * const end   = BanglaDate.fromBanglaDate(1432, 3, 15);
   *
   * end.diff(start, 'days');    // 76
   * end.diff(start, 'months');  // 2
   * start.diff(end, 'days');    // -76   (negative — start is before end)
   *
   * const a = BanglaDate.fromBanglaDate(1430, 5, 20);
   * const b = BanglaDate.fromBanglaDate(1432, 3, 10);
   * b.diff(a, 'years'); // 1   (only 1 full year has elapsed)
   */
  diff(other: BanglaDate, unit: "days" | "months" | "years" = "days"): number {
    if (unit === "days") {
      return Math.floor(
        (this.gregorianDate.getTime() - other.gregorianDate.getTime()) /
          86_400_000
      );
    }
    if (unit === "months") {
      let months =
        (this.banglaYear - other.banglaYear) * 12 +
        (this.banglaMonthIndex - other.banglaMonthIndex);
      // Sign-aware day-of-month adjustment: only trim when the incomplete
      // month lies in the same direction as the overall sign.
      if (months > 0 && this.banglaDay < other.banglaDay) months--;
      else if (months < 0 && this.banglaDay > other.banglaDay) months++;
      return months;
    }
    // years — respect month + day offset, sign-aware
    let years = this.banglaYear - other.banglaYear;
    if (years > 0) {
      if (
        this.banglaMonthIndex < other.banglaMonthIndex ||
        (this.banglaMonthIndex === other.banglaMonthIndex &&
          this.banglaDay < other.banglaDay)
      )
        years--;
    } else if (years < 0) {
      if (
        this.banglaMonthIndex > other.banglaMonthIndex ||
        (this.banglaMonthIndex === other.banglaMonthIndex &&
          this.banglaDay > other.banglaDay)
      )
        years++;
    }
    return years;
  }

  // ── Start / End Helpers ──────────────────────────────────────────────────

  /**
   * Returns a **new** `BanglaDate` set to the **first day** of the current
   * Bangla month, at midnight UTC. This instance is not mutated.
   *
   * Equivalent to `BanglaDate.fromBanglaDate(year, month, 1)`.
   *
   * @returns A new `BanglaDate` at day 1 of this month.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 3, 20).startOfMonth().toString();
   * // "1 Asharh 1432 BA"
   */
  startOfMonth(): BanglaDate {
    return BanglaDate.fromBanglaDate(
      this.banglaYear,
      this.banglaMonthIndex + 1,
      1,
      this.language
    );
  }

  /**
   * Returns a **new** `BanglaDate` set to the **last day** of the current
   * Bangla month, at midnight UTC. This instance is not mutated.
   *
   * The last day is determined by `getMonthLengths()` and correctly handles
   * Bangla leap years (Chaitra = 30 or 31 days).
   *
   * @returns A new `BanglaDate` at the last day of this month.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 5).endOfMonth().toString();
   * // "31 Boishakh 1432 BA"  (Boishakh always has 31 days)
   *
   * BanglaDate.fromBanglaDate(1432, 6, 1).endOfMonth().toString();
   * // "30 Ashwin 1432 BA"    (Ashwin has 30 days)
   */
  endOfMonth(): BanglaDate {
    const monthLengths = BanglaDate.getMonthLengths(this.banglaYear + 593);
    const lastDay = monthLengths[this.banglaMonthIndex];
    return BanglaDate.fromBanglaDate(
      this.banglaYear,
      this.banglaMonthIndex + 1,
      lastDay,
      this.language
    );
  }

  /**
   * Returns a **new** `BanglaDate` set to **1 Boishakh** (the first day of
   * the Bangla year) at midnight UTC. This instance is not mutated.
   *
   * @returns A new `BanglaDate` at 1 Boishakh of this Bangla year.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 8, 15).startOfYear().toString();
   * // "1 Boishakh 1432 BA"  (= 2025-04-14 UTC)
   */
  startOfYear(): BanglaDate {
    return BanglaDate.fromBanglaDate(this.banglaYear, 1, 1, this.language);
  }

  /**
   * Returns a **new** `BanglaDate` set to the **last day of Chaitra** (the
   * final day of the Bangla year) at midnight UTC. This instance is not mutated.
   *
   * Chaitra has 30 days in a common year and 31 days in a Bangla leap year
   * (when the following Gregorian year is a leap year).
   *
   * @returns A new `BanglaDate` at 30 or 31 Chaitra of this Bangla year.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 3, 1).endOfYear().toString();
   * // "30 Chaitra 1432 BA"  (2026 is not a Gregorian leap year)
   */
  endOfYear(): BanglaDate {
    const monthLengths = BanglaDate.getMonthLengths(this.banglaYear + 593);
    return BanglaDate.fromBanglaDate(
      this.banglaYear,
      12,
      monthLengths[11],
      this.language
    );
  }

  // ── Calendar Info ────────────────────────────────────────────────────────

  /**
   * Returns the **1-based day number** within the Bangla year.
   *
   * Day 1 = 1 Boishakh. The maximum value is 365 in a common year and
   * 366 in a Bangla leap year (when Chaitra has 31 days).
   *
   * @returns Integer in the range 1–366 indicating the ordinal day of the year.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 1).getDayOfYear();  // 1
   * BanglaDate.fromBanglaDate(1432, 2, 1).getDayOfYear();  // 32  (after 31-day Boishakh)
   * BanglaDate.fromBanglaDate(1432, 6, 1).getDayOfYear();  // 156 (after 5×31 days)
   */
  getDayOfYear(): number {
    const monthLengths = BanglaDate.getMonthLengths(this.banglaYear + 593);
    let doy = 0;
    for (let i = 0; i < this.banglaMonthIndex; i++) {
      doy += monthLengths[i];
    }
    return doy + this.banglaDay;
  }

  /**
   * Returns the **Bengali season (Ritu)** name for the current month in
   * the instance's language.
   *
   * The Bengali calendar divides the year into six two-month seasons:
   *
   * | Months                  | en       | bn     | hi       |
   * |-------------------------|----------|--------|----------|
   * | Boishakh – Jyoishtho    | Grishmo  | গ্রীষ্ম | ग्रीष्म  |
   * | Asharh – Shrabon        | Borsha   | বর্ষা  | वर्षा    |
   * | Bhadro – Ashwin         | Shorot   | শরৎ    | शरद      |
   * | Kartik – Ogrohayon      | Hemonto  | হেমন্ত | हेमन्त   |
   * | Poush – Magh            | Sheet    | শীত    | शीत      |
   * | Falgun – Chaitra        | Boshonto | বসন্ত  | वसन्त    |
   *
   * @returns The season name in the instance's language.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 1, 'en').getRitu(); // "Grishmo"
   * BanglaDate.fromBanglaDate(1432, 1, 1, 'bn').getRitu(); // "গ্রীষ্ম"
   * BanglaDate.fromBanglaDate(1432, 9, 1, 'en').getRitu(); // "Sheet"
   */
  getRitu(): string {
    const ritu: Record<Language, string[]> = {
      en: ["Grishmo", "Borsha", "Shorot", "Hemonto", "Sheet", "Boshonto"],
      bn: ["গ্রীষ্ম", "বর্ষা", "শরৎ", "হেমন্ত", "শীত", "বসন্ত"],
      hi: ["ग्रीष्म", "वर्षा", "शरद", "हेमन्त", "शीत", "वसन्त"],
    };
    return ritu[this.language][Math.floor(this.banglaMonthIndex / 2)];
  }

  /**
   * Returns the **era label** for the Bangla calendar in the instance's language.
   *
   * The Bangla era is called *Bangabda* (বঙ্গাব্দ). Its epoch is traditionally
   * placed at 594 CE. This label should not be confused with the Gregorian
   * BC/AD era used by `Intl.DateTimeFormat`.
   *
   * | Language | Era label   |
   * |----------|-------------|
   * | `en`     | `"BA"`       |
   * | `bn`     | `"বঙ্গাব্দ"` |
   * | `hi`     | `"बंगाब्द"` |
   *
   * @returns The era label string in the instance's language.
   *
   * @example
   * BanglaDate.today('en').getEra(); // "BA"
   * BanglaDate.today('bn').getEra(); // "বঙ্গাব্দ"
   * BanglaDate.today('hi').getEra(); // "बंगाब्द"
   */
  getEra(): string {
    switch (this.language) {
      case "bn":
        return "বঙ্গাব্দ";
      case "hi":
        return "बंगाब्द";
      default:
        return "BA"; // Bangabda
    }
  }

  /**
   * Returns the name of a **major Bengali festival** that falls on this date,
   * or an empty string if no recognised festival occurs today.
   *
   * Festival dates follow the **revised Bangladesh National Calendar**:
   *
   * | Bangla date               | en                              |
   * |---------------------------|---------------------------------|
   * | 1 Boishakh                | Pohela Boishakh (Bengali New Year) |
   * | 25 Boishakh               | Rabindra Jayanti                |
   * | 11 Jyoishtho              | Nazrul Jayanti                  |
   * | Last day of Chaitra       | Chaitra Sangkranti (Year end)   |
   *
   * The returned string is in the instance's language (`en` / `bn` / `hi`).
   * Chaitra Sangkranti is computed dynamically (30th or 31st Chaitra
   * depending on whether it is a Bangla leap year).
   *
   * @returns The festival name in the instance's language, or `""` if none.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 1, 'en').getFestival();
   * // "Pohela Boishakh (Bengali New Year)"
   *
   * BanglaDate.fromBanglaDate(1432, 1, 1, 'bn').getFestival();
   * // "পহেলা বৈশাখ (নববর্ষ)"
   *
   * BanglaDate.fromBanglaDate(1432, 3, 1, 'en').getFestival();
   * // ""  (no festival on 1 Asharh)
   */
  getFestival(): string {
    // Key: "monthIndex-day" (0-indexed month)
    const festivals: Record<string, Record<Language, string>> = {
      "0-1": {
        en: "Pohela Boishakh (Bengali New Year)",
        bn: "পহেলা বৈশাখ (নববর্ষ)",
        hi: "पहला बैशाख (नव वर्ष)",
      },
      "0-25": {
        en: "Rabindra Jayanti",
        bn: "রবীন্দ্র জয়ন্তী",
        hi: "रवींद्र जयंति",
      },
      "1-11": {
        en: "Nazrul Jayanti",
        bn: "নজরুল জয়ন্তী",
        hi: "नजरुल जयंति",
      },
    };
    // Chaitra Sangkranti is always the LAST day of Chaitra (30 in regular
    // years, 31 in Bangla leap years), so compute it dynamically.
    const chaitraLastDay = BanglaDate.getMonthLengths(
      this.banglaYear + 593
    )[11];
    festivals[`11-${chaitraLastDay}`] = {
      en: "Chaitra Sangkranti (Year end)",
      bn: "চৈত্র সংক্রান্তি",
      hi: "चैत्र संक्रांति",
    };
    const key = `${this.banglaMonthIndex}-${this.banglaDay}`;
    return festivals[key]?.[this.language] ?? "";
  }

  /**
   * Returns a **human-readable relative time string** comparing this date to
   * today (midnight UTC), in the instance's language.
   *
   * **Thresholds:**
   * - 0 days difference → `"today"` / `"আজ"` / `"आज"`
   * - 1 day difference → `"yesterday"`/`"tomorrow"` (language-aware)
   * - < 30 days → `"N days ago"` / `"in N days"`
   * - 30+ days but < 12 months → `"N months ago"` / `"in N months"`
   *   (falls back to days if no full Bangla month boundary has been crossed)
   * - 12+ months → `"N years ago"` / `"in N years"`
   *
   * @returns A localised relative time string in the instance's language.
   *
   * @example
   * // Assuming today is 24 Falgun 1432
   * BanglaDate.fromBanglaDate(1432, 2, 24).relativeTime(); // "in 1 month"
   * BanglaDate.fromBanglaDate(1432, 2, 23).relativeTime(); // "1 month ago" (approx)
   * BanglaDate.today('bn').relativeTime();                  // "আজ"
   * BanglaDate.today().add(1, 'days').relativeTime();       // "tomorrow"
   * BanglaDate.today().subtract(1, 'days').relativeTime();  // "yesterday"
   * BanglaDate.fromBanglaDate(1430, 1, 1).relativeTime();  // "2 years ago"
   */
  relativeTime(): string {
    const today = BanglaDate.today();
    const diffDays = today.diff(this, "days");
    const absDiff = Math.abs(diffDays);
    const isFuture = diffDays < 0;

    const fmt = (value: number, unit: "day" | "month" | "year"): string => {
      const vStr = numberToNumber(value, this.language);
      if (this.language === "bn") {
        if (unit === "day") {
          if (absDiff === 0) return "আজ";
          if (absDiff === 1) return isFuture ? "আগামীকাল" : "গতকাল";
          return isFuture ? `${vStr} দিন পরে` : `${vStr} দিন আগে`;
        }
        if (unit === "month")
          return isFuture ? `${vStr} মাস পরে` : `${vStr} মাস আগে`;
        return isFuture ? `${vStr} বছর পরে` : `${vStr} বছর আগে`;
      }
      if (this.language === "hi") {
        if (unit === "day") {
          if (absDiff === 0) return "आज";
          if (absDiff === 1) return isFuture ? "आने वाला कल" : "बीता हुआ कल";
          return isFuture ? `${vStr} दिन बाद` : `${vStr} दिन पहले`;
        }
        if (unit === "month")
          return isFuture ? `${vStr} महिने बाद` : `${vStr} महिने पहले`;
        return isFuture ? `${vStr} साल बाद` : `${vStr} साल पहले`;
      }
      // English
      if (unit === "day") {
        if (absDiff === 0) return "today";
        if (absDiff === 1) return isFuture ? "tomorrow" : "yesterday";
        return isFuture ? `in ${value} days` : `${value} days ago`;
      }
      if (unit === "month")
        return isFuture
          ? `in ${value} month${value === 1 ? "" : "s"}`
          : `${value} month${value === 1 ? "" : "s"} ago`;
      return isFuture
        ? `in ${value} year${value === 1 ? "" : "s"}`
        : `${value} year${value === 1 ? "" : "s"} ago`;
    };

    if (absDiff < 30) return fmt(absDiff, "day");
    const monthDiff = Math.abs(today.diff(this, "months"));
    // monthDiff can be 0 when ≥30 days have passed but the Bangla month
    // boundary hasn't been crossed yet — fall back to displaying days.
    if (monthDiff === 0) return fmt(absDiff, "day");
    if (monthDiff < 12) return fmt(monthDiff, "month");
    return fmt(Math.abs(today.diff(this, "years")), "year");
  }

  // ── Utility / conversion ─────────────────────────────────────────────────

  /**
   * Returns a **defensive copy** of the underlying Gregorian `Date` object.
   *
   * Modifying the returned `Date` does not affect this `BanglaDate` instance.
   * Use this when you need to pass the date to APIs that expect a native `Date`,
   * such as `Date.prototype.toISOString()` or third-party date libraries.
   *
   * @returns A new `Date` instance with the same Unix timestamp as this
   *   `BanglaDate`.
   *
   * @example
   * const d = BanglaDate.fromBanglaDate(1432, 1, 1);
   * d.toGregorian().toISOString(); // "2025-04-14T00:00:00.000Z"
   */
  toGregorian(): Date {
    return new Date(this.gregorianDate.getTime());
  }

  /**
   * Returns a **plain-object snapshot** of this date suitable for
   * `JSON.stringify` serialisation.
   *
   * All numeric fields are raw integers (not localised digit strings).
   * The `era` field is the language-aware era label from `getEra()`.
   *
   * Shape:
   * ```json
   * {
   *   "year": 1432,
   *   "month": 1,
   *   "day": 5,
   *   "era": "BA",
   *   "hours": 6,
   *   "minutes": 30,
   *   "seconds": 0,
   *   "milliseconds": 0
   * }
   * ```
   *
   * @returns A plain object representation of this `BanglaDate`.
   *
   * @example
   * const d = BanglaDate.fromBanglaDate(1432, 1, 5, 'bn');
   * JSON.stringify(d);
   * // '{"year":1432,"month":1,"day":5,"era":"বঙ্গাব্দ","hours":0,...}'
   */
  toJSON(): {
    year: number;
    month: number;
    day: number;
    era: string;
    hours: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
  } {
    return {
      year: this.banglaYear,
      month: this.banglaMonthIndex + 1,
      day: this.banglaDay,
      era: this.getEra(),
      hours: this.getHours(),
      minutes: this.getMinutes(),
      seconds: this.getSeconds(),
      milliseconds: this.getMilliseconds(),
    };
  }

  /**
   * Returns a **new, independent** `BanglaDate` that is an exact copy of
   * this instance — same Gregorian timestamp, same language setting.
   *
   * Use this before passing a `BanglaDate` to code that may mutate it, or
   * when you need to branch two date calculations from the same starting point.
   *
   * @returns A new `BanglaDate` identical to `this`.
   *
   * @example
   * const a = BanglaDate.fromBanglaDate(1432, 1, 15, 'bn');
   * const b = a.clone();
   * b.add(10, 'days'); // does not affect `a` (both are immutable anyway)
   * a.isSame(b);       // true — same date
   */
  clone(): BanglaDate {
    return new BanglaDate(this.gregorianDate, this.language);
  }

  /**
   * Allows the instance to be used directly in **numeric and string contexts**
   * without an explicit method call.
   *
   * - **Numeric hint** (e.g. `+d`, `d - other`, comparison operators) →
   *   returns the Unix timestamp in milliseconds (same as `getTime()`).
   * - **String hint** (e.g. template literals `` `${d}` ``, string
   *   concatenation) → returns the `toString()` value.
   * - **Default hint** → returns the `toString()` value.
   *
   * @param hint - The type hint provided by the JS engine: `"number"`,
   *   `"string"`, or `"default"`.
   * @returns The Unix timestamp (ms) for numeric hint, otherwise the
   *   localised date string from `toString()`.
   *
   * @example
   * const d = BanglaDate.fromBanglaDate(1432, 1, 1, 'bn');
   * +d;           // 1744588800000  (Unix ms timestamp)
   * `Date: ${d}`; // "Date: ১ বৈশাখ ১৪৩২ বঙ্গাব্দ"
   */
  [Symbol.toPrimitive](hint: string): string | number {
    return hint === "number" ? this.getTime() : this.toString();
  }

  // ── String Representations ───────────────────────────────────────────────

  /**
   * Returns the **full localised date string** including the era label.
   *
   * Format: `"<day> <monthName> <year> <era>"`
   *
   * All digit characters are localised to the instance's language:
   * - `en` → Latin digits, English month names: `"15 Boishakh 1432 BA"`
   * - `bn` → Bengali digits, Bengali month names: `"১৫ বৈশাখ ১৪৩২ বঙ্গাব্দ"`
   * - `hi` → Devanagari digits, Hindi month names: `"१५ बैशाख १४३२ बंगाब्द"`
   *
   * This method is called automatically when the instance is coerced to a
   * string (e.g. in template literals or string concatenation).
   *
   * @returns Localised date string in `"DD MMMM YYYY era"` format.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 15, 'en').toString();
   * // "15 Boishakh 1432 BA"
   *
   * BanglaDate.fromBanglaDate(1432, 1, 15, 'bn').toString();
   * // "১৫ বৈশাখ ১৪৩২ বঙ্গাব্দ"
   */
  toString(): string {
    const monthName = this.getMonthName();
    const day = numberToNumber(this.banglaDay, this.language);
    const year = numberToNumber(this.banglaYear, this.language);
    return `${day} ${monthName} ${year} ${this.getEra()}`;
  }

  /**
   * Returns a **short date string with the weekday** name, without the era.
   *
   * Format: `"<weekdayFull>, <day> <monthFull> <year>"`
   *
   * The weekday and month names are in the instance's language. Digits are
   * localised. The year is the full 4-digit Bangla year.
   *
   * @returns Localised date string in `"WWWW, DD MMMM YYYY"` format.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 14, 'en').toDateString();
   * // "Monday, 14 Boishakh 1432"
   *
   * BanglaDate.fromBanglaDate(1432, 1, 14, 'bn').toDateString();
   * // "সোমবার, ১৪ বৈশাখ ১৪৩২"
   */
  toDateString(): string {
    const monthName = this.getMonthName();
    return `${this.getWeekDay()}, ${numberToNumber(
      this.banglaDay,
      this.language
    )} ${monthName} ${numberToNumber(this.banglaYear, this.language)}`;
  }

  // ── Accessor Methods (all return raw numbers) ───────────────────────────
  //
  // Presentation-layer callers (format, toLocaleDateString, toLocaleString,
  // toDateString, toString) should call numberToNumber() themselves when they
  // need localised digit strings.  Returning numbers here keeps the API
  // composable and testable.

  /**
   * Returns the day of the Bangla month as a raw number.
   * Range: 1–31 (months 1–5 can have 31; Chaitra has 30 or 31 in a leap year).
   * @returns Bangla day of month (1-based).
   */
  getDate(): number {
    return this.banglaDay;
  }

  /**
   * Returns the UTC weekday index of the underlying Gregorian date.
   * The Bangla calendar shares the same 7-day week as the Gregorian calendar.
   * @returns `0` = Sunday, `1` = Monday, … `6` = Saturday.
   */
  getDay(): number {
    return this.gregorianDate.getUTCDay();
  }

  /**
   * Returns the full 4-digit Bangla year.
   * @returns e.g. `1432`.
   */
  getFullYear(): number {
    return this.banglaYear;
  }

  /**
   * Returns the UTC hour component of the underlying timestamp.
   * @returns Integer in the range 0–23.
   */
  getHours(): number {
    return this.gregorianDate.getUTCHours();
  }

  /**
   * Returns the UTC milliseconds component of the underlying timestamp.
   * @returns Integer in the range 0–999.
   */
  getMilliseconds(): number {
    return this.gregorianDate.getUTCMilliseconds();
  }

  /**
   * Returns the UTC minutes component of the underlying timestamp.
   * @returns Integer in the range 0–59.
   */
  getMinutes(): number {
    return this.gregorianDate.getUTCMinutes();
  }

  /**
   * Returns the 1-indexed Bangla month number.
   * @returns `1` = Boishakh, `2` = Jyoishtho, … `12` = Chaitra.
   */
  getMonth(): number {
    return this.banglaMonthIndex + 1;
  }

  /**
   * Returns the UTC seconds component of the underlying timestamp.
   * @returns Integer in the range 0–59.
   */
  getSeconds(): number {
    return this.gregorianDate.getUTCSeconds();
  }

  /**
   * Returns the Unix timestamp (milliseconds since 1970-01-01T00:00:00Z).
   * Identical to the value returned by the underlying `Date.prototype.getTime()`.
   * Useful for comparisons, storage, and interop with native Date APIs.
   * @returns Milliseconds since Unix epoch.
   */
  getTime(): number {
    return this.gregorianDate.getTime();
  }

  /**
   * Returns the host's timezone offset from UTC, in minutes.
   * Mirrors `Date.prototype.getTimezoneOffset()`.
   * A positive value means UTC is ahead (e.g. UTC−5 → `300`);
   * a negative value means UTC is behind (e.g. UTC+6 → `-360`).
   * @returns Timezone offset in minutes.
   */
  getTimezoneOffset(): number {
    return this.gregorianDate.getTimezoneOffset();
  }

  // UTC variants — these mirror the underlying Gregorian UTC getters and
  // operate on the raw Gregorian timestamp, not the Bangla calendar fields.

  /** Returns the UTC day-of-month of the underlying Gregorian date (1-based). */
  getUTCDate(): number {
    return this.gregorianDate.getUTCDate();
  }
  /** Returns the UTC weekday of the underlying Gregorian date (0 = Sunday … 6 = Saturday). */
  getUTCDay(): number {
    return this.gregorianDate.getUTCDay();
  }
  /** Returns the UTC 4-digit Gregorian year of the underlying timestamp. */
  getUTCFullYear(): number {
    return this.gregorianDate.getUTCFullYear();
  }
  /** Returns the UTC hour (0–23) of the underlying timestamp. */
  getUTCHours(): number {
    return this.gregorianDate.getUTCHours();
  }
  /** Returns the UTC milliseconds (0–999) of the underlying timestamp. */
  getUTCMilliseconds(): number {
    return this.gregorianDate.getUTCMilliseconds();
  }
  /** Returns the UTC minutes (0–59) of the underlying timestamp. */
  getUTCMinutes(): number {
    return this.gregorianDate.getUTCMinutes();
  }
  /** Returns the UTC **Gregorian** month index (0–11) of the underlying timestamp. Not a Bangla field. */
  getUTCMonth(): number {
    return this.gregorianDate.getUTCMonth();
  }
  /** Returns the UTC seconds (0–59) of the underlying timestamp. */
  getUTCSeconds(): number {
    return this.gregorianDate.getUTCSeconds();
  }

  /**
   * Returns the **full 4-digit Bangla year**.
   *
   * This is an alias of `getFullYear()`. Unlike the deprecated standard
   * `Date.prototype.getYear()` (which returns the year minus 1900),
   * this method always returns the complete year (e.g. `1432`, not `432`).
   *
   * @returns Full Bangla year (e.g. `1432`).
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 1).getYear(); // 1432
   */
  getYear(): number {
    return this.banglaYear;
  }
  // **Formatted Output**:
  /**
   * Returns the full (long) month name in the instance's language.
   * Internal helper — delegates to `getFormattedMonthName('long')`.
   * @internal
   */
  private getMonthName(): string {
    return this.getFormattedMonthName("long");
  }

  /**
   * Returns the full (long) weekday name in the instance's language.
   * Internal helper — delegates to `getWeekDayFormat('long')`.
   * @internal
   */
  private getWeekDay(): string {
    return this.getWeekDayFormat("long");
  }

  /**
   * Returns an **ISO 8601-like string** using Bangla calendar coordinates
   * instead of Gregorian ones.
   *
   * Format: `"YYYY-MM-DDThh:mm:ss.mmmZ"`
   * where `YYYY`, `MM`, and `DD` are the Bangla year, month, and day;
   * the time portion (`hh:mm:ss.mmm`) is always in UTC.
   *
   * > Note: This string uses Bangla calendar values and is therefore **not**
   * > a standards-compliant ISO 8601 Gregorian date string. To obtain a
   * > standards-compliant string, call `toGregorian().toISOString()`.
   *
   * @returns ISO-like string, e.g. `"1432-01-14T00:00:00.000Z"`.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 14).toISOString();
   * // "1432-01-14T00:00:00.000Z"
   *
   * // Compare with the Gregorian equivalent:
   * BanglaDate.fromBanglaDate(1432, 1, 14).toGregorian().toISOString();
   * // "2025-04-14T00:00:00.000Z"
   */
  toISOString(): string {
    const y = this.banglaYear.toString().padStart(4, "0");
    const mo = (this.banglaMonthIndex + 1).toString().padStart(2, "0");
    const d = this.banglaDay.toString().padStart(2, "0");
    const h = this.getHours().toString().padStart(2, "0");
    const mi = this.getMinutes().toString().padStart(2, "0");
    const s = this.getSeconds().toString().padStart(2, "0");
    const ms = this.getMilliseconds().toString().padStart(3, "0");
    return `${y}-${mo}-${d}T${h}:${mi}:${s}.${ms}Z`;
  }
  /**
   * Returns a localised **date-only** string using `Intl.DateTimeFormat` formatting
   * but substituting all Gregorian fields with their Bangla calendar equivalents.
   *
   * Mirrors the signature of `Date.prototype.toLocaleDateString`.
   *
   * @param locales - A BCP 47 locale string or array. Supported base languages:
   *   `"en"` / `"en-US"`, `"bn"` / `"bn-BD"`, `"hi"` / `"hi-IN"`.
   *   Defaults to the language set on the instance.
   * @param options - An `Intl.DateTimeFormatOptions` object. When omitted,
   *   defaults to `{ year: 'numeric', month: 'numeric', day: 'numeric' }`.
   *   The `timeZone` property may be any IANA timezone string (e.g.
   *   `"Asia/Dhaka"`). When a non-UTC timezone is provided, the Bangla
   *   calendar date fields are recomputed for that local date.
   * @returns A formatted date string, e.g. `"14/4/1432"` or `"১৪/৪/১৪৩২"`.
   *
   * @example
   * const d = BanglaDate.fromBanglaDate(1432, 1, 14, 'en');
   * d.toLocaleDateString('en-US'); // "4/14/1432" (US order)
   * d.toLocaleDateString('bn-BD', { month: 'long' }); // "১৪ বৈশাখ ১৪৩২"
   */
  toLocaleDateString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    // Default to date-only when no options are supplied, mirroring the
    // behaviour of Date.prototype.toLocaleDateString.
    const dateOnlyOptions: Intl.DateTimeFormatOptions = options ?? {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    return this._applyLocale(locales, dateOnlyOptions);
  }

  /**
   * Returns a **localised UTC time string** in `HH:mm:ss UTC` format.
   *
   * Hour, minute, and second digits are rendered in the instance's
   * language script (Latin / Bengali / Devanagari). The timezone label
   * is always the literal string `" UTC"`.
   *
   * @returns Localised time string, e.g.
   *   - `en`: `"08:30:05 UTC"`
   *   - `bn`: `"০৮:৩০:০৫ UTC"`
   *   - `hi`: `"०८:३०:०५ UTC"`
   *
   * @example
   * const d = new BanglaDate(new Date('2025-04-14T08:30:05Z'), 'bn');
   * d.toTimeString(); // "০৮:৩০:০৫ UTC"
   */
  toTimeString(): string {
    const pad = (n: number): string => n.toString().padStart(2, "0");
    const h = numberToNumber(pad(this.getHours()), this.language);
    const m = numberToNumber(pad(this.getMinutes()), this.language);
    const s = numberToNumber(pad(this.getSeconds()), this.language);
    return `${h}:${m}:${s} UTC`;
  }

  /**
   * Zero-pads a number or numeric string to at least 2 digits.
   * Used internally by `format()` for `MM`, `DD`, `HH`, `mm`, `ss` tokens.
   * @param num - The value to pad.
   * @returns A string of at least 2 characters (e.g. `"05"` for `5`).
   * @internal
   */
  private formatNumber(num: number | string): string {
    return num.toString().padStart(2, "0");
  }

  /**
   * Returns the AM/PM (or Bengali/Hindi equivalent) day-period string
   * for the given UTC hour.
   *
   * | Language | AM           | PM           |
   * |----------|--------------|---------------|
   * | `en`     | `"AM"`       | `"PM"`        |
   * | `bn`     | `"পূর্বাহ্ণ"` | `"অপরাহ্ণ"`  |
   * | `hi`     | `"पूर्वाह्न"` | `"अपराह्न"`  |
   *
   * @param hour - UTC hour (0–23) as a number or numeric string.
   * @returns The localised day-period label.
   * @internal
   */
  private getAMPM(hour: number | string): string {
    const h = parseInt(hour.toString(), 10);
    return h >= 12
      ? this.language === "bn"
        ? "অপরাহ্ণ"
        : this.language === "hi"
        ? "अपराह्न"
        : "PM"
      : this.language === "bn"
      ? "পূর্বাহ্ণ"
      : this.language === "hi"
      ? "पूर्वाह्न"
      : "AM";
  }
  /**
   * Formats the Bangla date using a custom format string inspired by Moment.js / Day.js.
   *
   * Digits in the output are automatically localised to the language set on
   * the instance (`"en"`, `"bn"`, or `"hi"`).
   *
   * ### Format Tokens
   *
   * | Token    | Output example              | Description                                 |
   * |----------|-----------------------------|---------------------------------------------|
   * | `YYYY`   | `1432`                      | 4-digit Bangla year                         |
   * | `YY`     | `32`                        | 2-digit Bangla year                         |
   * | `MMMM`   | `Boishakh` / `বৈশাখ`        | Full month name                             |
   * | `MMM`    | `Boi` / `বৈশা`              | Short month name (3–4 chars)                |
   * | `MM`     | `01`                        | Zero-padded 2-digit month (01–12)           |
   * | `M`      | `1`                         | Month without padding (1–12)                |
   * | `DD`     | `05`                        | Zero-padded day of month (01–31)            |
   * | `D`      | `5`                         | Day of month without padding (1–31)         |
   * | `Do`     | `1st` / `পহেলা` / `पहला`   | Ordinal day of month                        |
   * | `WWWW`   | `Sunday` / `রবিবার`         | Full weekday name                           |
   * | `WWW`    | `Sun` / `রবি`               | Short weekday name                          |
   * | `WW`     | `00`                        | Zero-padded weekday index (00=Sun…06=Sat)   |
   * | `W`      | `0`                         | Weekday index (0=Sun…6=Sat)                 |
   * | `HH`     | `08`                        | Zero-padded 24-hour (00–23)                 |
   * | `H`      | `8`                         | 24-hour without padding (0–23)              |
   * | `mm`     | `05`                        | Zero-padded minutes (00–59)                 |
   * | `m`      | `5`                         | Minutes without padding (0–59)              |
   * | `ss`     | `09`                        | Zero-padded seconds (00–59)                 |
   * | `s`      | `9`                         | Seconds without padding (0–59)              |
   * | `AM/PM`  | `AM` / `PM`                 | Day period in uppercase                     |
   * | `era`    | `BA` / `বঙ্গাব্দ`           | Era label                                   |
   *
   * ### Escape Sequences
   * Wrap literal text in square brackets `[...]` to prevent it from being
   * treated as format tokens or having its digits localised.
   *
   * @param formatString - A format string composed of the tokens listed above
   *   and optional literal sections enclosed in `[...]`.
   * @returns The formatted date string with localised digits.
   * @throws {BanglaDateError} If more than 26 `[...]` escape sections are used.
   *
   * @example
   * const d = BanglaDate.fromBanglaDate(1432, 1, 5, 'en');
   * d.format('DD MMMM YYYY');           // "05 Boishakh 1432"
   * d.format('YYYY-MM-DD');             // "1432-01-05"
   * d.format('Do MMMM YYYY [era]');     // "5th Boishakh 1432 era"  ("era" literal)
   * d.format('Do MMMM YYYY era');       // "5th Boishakh 1432 BA"   (era token)
   * d.format('WWWW, DD MMMM YYYY');     // "Monday, 05 Boishakh 1432"
   * d.format('HH:mm:ss AM/PM');         // "06:00:00 AM"
   *
   * // Bengali output
   * const bn = BanglaDate.fromBanglaDate(1432, 1, 5, 'bn');
   * bn.format('DD MMMM YYYY');          // "০৫ বৈশাখ ১৪৩২"
   */
  // Main format function
  format(formatString: string): string {
    const year = this.banglaYear;
    const month = this.banglaMonthIndex + 1;
    const day = this.banglaDay;
    const hours = this.getHours();
    const minutes = this.getMinutes();
    const seconds = this.getSeconds();

    const replacements: Record<string, string> = {
      Do: this.getOrdinalDate(),
      WWWW: this.getWeekDayFormat("long"),
      WWW: this.getWeekDayFormat("short"),
      // WW/W = zero-padded / bare weekday index (0=Sun … 6=Sat).
      // Note: WW is NOT ISO week-number; use an external library for that.
      WW: this.gregorianDate.getUTCDay().toString().padStart(2, "0"),
      W: this.gregorianDate.getUTCDay().toString(),
      era: this.getEra(),
      YYYY: year.toString().padStart(4, "0"),
      YY: (year % 100).toString().padStart(2, "0"),
      MMMM: this.getFormattedMonthName("long"),
      MMM: this.getFormattedMonthName("short"),
      MM: this.formatNumber(month),
      M: month.toString(),
      DD: this.formatNumber(day),
      D: day.toString(),
      HH: this.formatNumber(hours),
      H: hours.toString(),
      mm: this.formatNumber(minutes),
      m: minutes.toString(),
      ss: this.formatNumber(seconds),
      s: seconds.toString(),
      "AM/PM": this.getAMPM(hours),
    };

    // 1. Stash [...] escape sections as null-byte-delimited placeholders so
    //    token expansion and digit localisation leave them untouched.
    //    We encode the index as a capital letter (A, B, …) so numberToNumber
    //    cannot accidentally localise the placeholder key.  Supports up to 26
    //    independent escape sections (more than enough in practice).
    const literals: string[] = [];
    const template = formatString.replace(
      /\[([^\]]*?)\]/g,
      (_: string, inner: string) => {
        if (literals.length >= 26) {
          throw new BanglaDateError(
            "format() supports at most 26 escaped [...] sections."
          );
        }
        literals.push(inner);
        return `\x00${String.fromCharCode(65 + literals.length - 1)}\x00`;
      }
    );

    // 2. Expand format tokens
    const expanded = template.replace(
      /Do|WWWW|WWW|WW|W|YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s|AM\/PM|era/g,
      (match) => replacements[match] ?? match
    );

    // 3. Localise digits (letter-keyed placeholders pass through unmodified)
    const localised = numberToNumber(expanded, this.language);

    // 4. Restore escaped literals verbatim (no digit localisation applied)
    return localised.replace(
      /\x00([A-Z])\x00/g,
      (_: string, key: string) => literals[key.charCodeAt(0) - 65] ?? ""
    );
  }

  /**
   * Returns the Bangla month name in the instance's language and the
   * requested display format.
   *
   * | Format    | Example (en)   | Example (bn)   |
   * |-----------|----------------|----------------|
   * | `long`    | `"Boishakh"`   | `"বৈশাখ"`      |
   * | `short`   | `"Boi"`        | `"বৈশা"`       |
   * | `narrow`  | `"B"`          | `"বৈ"`         |
   *
   * Called internally by `toString()`, `toDateString()`, `format()` (for
   * `MMMM` / `MMM`), and `_applyLocale()` (for named-month locale output).
   *
   * @param format - Display format. Defaults to `"long"`.
   * @returns The month name string.
   * @internal
   */
  private getFormattedMonthName(
    format: "long" | "short" | "narrow" = "long"
  ): string {
    const monthNames: Record<
      Language,
      Record<"long" | "short" | "narrow", string[]>
    > = {
      en: {
        long: [
          "Boishakh",
          "Jyoishtho",
          "Asharh",
          "Shrabon",
          "Bhadro",
          "Ashwin",
          "Kartik",
          "Ogrohayon",
          "Poush",
          "Magh",
          "Falgun",
          "Chaitra",
        ],
        short: [
          "Boi",
          "Jyo",
          "Asr",
          "Shr",
          "Bha",
          "Asw",
          "Kar",
          "Ogr",
          "Pou",
          "Mag",
          "Fal",
          "Cha",
        ],
        narrow: ["B", "J", "A", "S", "B", "A", "K", "O", "P", "M", "F", "C"],
      },
      bn: {
        long: [
          "বৈশাখ",
          "জ্যৈষ্ঠ",
          "আষাঢ়",
          "শ্রাবণ",
          "ভাদ্র",
          "আশ্বিন",
          "কার্তিক",
          "অগ্রহায়ণ",
          "পৌষ",
          "মাঘ",
          "ফাল্গুন",
          "চৈত্র",
        ],
        short: [
          "বৈশা",
          "জ্যৈষ",
          "আষা",
          "শ্রা",
          "ভা",
          "আশ্বি",
          "কার",
          "অগ্র",
          "পৌ",
          "মা",
          "ফাল",
          "চৈ",
        ],
        narrow: [
          "বৈ",
          "জ্যৈ",
          "আ",
          "শ্র",
          "ভা",
          "আ",
          "কা",
          "অ",
          "পৌ",
          "মা",
          "ফা",
          "চৈ",
        ],
      },
      hi: {
        long: [
          "बैशाख",
          "ज्येष्ठ",
          "आषाढ",
          "श्रावण",
          "भाद्रपद",
          "आश्विन",
          "कार्तिक",
          "अग्राहयण",
          "पौष",
          "माघ",
          "फाल्गुन",
          "चैत",
        ],
        short: [
          "बैश",
          "ज्ये",
          "आषा",
          "श्रा",
          "भा",
          "आश्र",
          "कार",
          "अग्र",
          "पौ",
          "मा",
          "फाल",
          "चै",
        ],
        narrow: [
          "बै",
          "ज्ये",
          "आ",
          "श्रा",
          "भा",
          "आ",
          "का",
          "अ",
          "पौ",
          "मा",
          "फा",
          "चै",
        ],
      },
    };
    return monthNames[this.language][format][this.banglaMonthIndex];
  }

  /**
   * Returns a localised **date and time** string using `Intl.DateTimeFormat`
   * formatting with all Gregorian calendar fields replaced by Bangla equivalents.
   *
   * Mirrors the signature of `Date.prototype.toLocaleString`.
   *
   * @param locales - A BCP 47 locale string or array. Supported base languages:
   *   `"en"` / `"en-US"`, `"bn"` / `"bn-BD"`, `"hi"` / `"hi-IN"`.
   *   Defaults to the language set on the instance.
   * @param options - An `Intl.DateTimeFormatOptions` object. When omitted,
   *   defaults to `{ year, month, day, hour, minute, second: 'numeric' }`.
   *   The `timeZone` property may be any IANA timezone string (e.g.
   *   `"Asia/Dhaka"`). When a non-UTC timezone is provided, the Bangla
   *   calendar date fields are recomputed for that local date.
   * @returns A formatted date-time string, e.g. `"14/4/1432, 6:00:00 AM"` or
   *   `"১৪/৪/১৪৩২, ৬:০০:০০ AM"`.
   *
   * @example
   * const d = BanglaDate.fromBanglaDate(1432, 1, 14, 'bn');
   * d.toLocaleString('bn-BD'); // "১৪/৪/১৪৩২, ৬:০০:০০ AM"
   * d.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
   * // "Monday, Boishakh 14, 1432"
   */
  toLocaleString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    // Default to date + time, mirroring Date.prototype.toLocaleString.
    const defaultOptions: Intl.DateTimeFormatOptions = options ?? {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return this._applyLocale(locales, defaultOptions);
  }

  /**
   * Returns a **localised time-only string** using `Intl.DateTimeFormat`
   * formatting. Mirrors the signature of `Date.prototype.toLocaleTimeString`.
   *
   * @param locales - A BCP 47 locale string or array. Supported base languages:
   *   `"en"` / `"en-US"`, `"bn"` / `"bn-BD"`, `"hi"` / `"hi-IN"`.
   *   Defaults to the language set on the instance.
   * @param options - An `Intl.DateTimeFormatOptions` object. When omitted,
   *   defaults to `{ hour: 'numeric', minute: 'numeric', second: 'numeric' }`.
   *   The `timeZone` property may be any IANA timezone string.
   * @returns A formatted time string, e.g. `"6:00:00 AM"` or `"৬:০০:০০ AM"`.
   *
   * @example
   * const d = new BanglaDate(new Date('2025-04-14T06:30:00Z'), 'bn');
   * d.toLocaleTimeString('bn-BD'); // "৬:৩০:০০ AM"
   * d.toLocaleTimeString('en-US'); // "6:30:00 AM"
   * d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); // "06:30 AM"
   */
  toLocaleTimeString(
    locales?: string | string[],
    options?: Intl.DateTimeFormatOptions
  ): string {
    const timeOnlyOptions: Intl.DateTimeFormatOptions = options ?? {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return this._applyLocale(locales, timeOnlyOptions);
  }

  /**
   * Shared implementation for `toLocaleDateString`, `toLocaleString`, and
   * `toLocaleTimeString`.
   *
   * Uses `Intl.DateTimeFormat.formatToParts()` with `timeZone: "UTC"` so that
   * the formatter and the UTC-based Bangla date components are always in sync,
   * regardless of the host timezone. Each part is substituted with the
   * corresponding Bangla value before being re-joined, which correctly handles
   * numeric fields, month/weekday names, day-period tokens, and literal
   * separators in a single pass — eliminating all fragile string-search
   * replacements and post-processing loops.
   *
   * @param locales - A BCP 47 locale string or array passed directly from the
   *   public method. Only `"en"`, `"bn"`, `"hi"` (and their region variants
   *   such as `"en-US"`, `"bn-BD"`, `"hi-IN"`) are supported. If `undefined`,
   *   the instance's own language is used as the fallback.
   * @param options - An `Intl.DateTimeFormatOptions` object controlling which
   *   fields appear in the output (e.g. `{ year: 'numeric', month: 'long' }`).
   *   The `timeZone` property may be any IANA timezone string (e.g.
   *   `"Asia/Dhaka"`, `"America/New_York"`). When a non-UTC timezone is
   *   supplied, the Bangla calendar date fields (year, month, day, weekday)
   *   are recomputed from the timezone-local Gregorian date so the output
   *   is consistent with the displayed local time.
   * @returns The formatted string with all Gregorian calendar fields replaced
   *   by their Bangla equivalents, and digits localised to the resolved script.
   * @throws {BanglaDateError} If the resolved locale is not one of the three
   *   supported languages.
   * @internal
   */
  private _applyLocale(
    locales: string | string[] | undefined,
    options: Intl.DateTimeFormatOptions | undefined
  ): string {
    // ── 1. Resolve locale — handle both string and string[] ───────────────
    const rawLocale = locales ?? this.language;
    const resolvedLocale: string = Array.isArray(rawLocale)
      ? rawLocale[0] ?? this.language
      : rawLocale.toString();

    const validLocales = ["en", "bn", "hi"];
    const isValidLocale = validLocales.some((v) =>
      resolvedLocale.startsWith(v)
    );
    if (!isValidLocale) {
      throw new BanglaDateError(
        `Locale "${resolvedLocale}" is not supported. Supported: ${validLocales.join(
          ", "
        )} (and variants like en-US, bn-BD, hi-IN).`
      );
    }

    const localeKey = resolvedLocale.split("-")[0] as "en" | "bn" | "hi";
    const tz = options?.timeZone ?? "UTC";
    const isUTC = tz.toUpperCase() === "UTC";

    // ── 2. Derive Bangla calendar fields for the requested timezone ────────
    // When a non-UTC timezone is specified the local calendar date may differ
    // from the UTC date (e.g. UTC 11 pm in UTC+6 is already the next day).
    // We extract the local Gregorian year/month/day via Intl, convert that
    // to a UTC-midnight Date, and build a temporary BanglaDate from it so
    // all date fields (year, month, day, weekday) reflect the local date.
    let banglaYear = this.banglaYear;
    let banglaMonthIndex = this.banglaMonthIndex;
    let banglaDay = this.banglaDay;
    let localWeekday = this.gregorianDate.getUTCDay();
    let localHour = this.gregorianDate.getUTCHours();

    if (!isUTC) {
      const localParts = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        weekday: "short",
        hour: "numeric",
        hour12: false,
        timeZone: tz,
      }).formatToParts(this.gregorianDate);

      const get = (t: string): number =>
        Number(localParts.find((p) => p.type === t)?.value ?? 0);

      const wdStr = localParts.find((p) => p.type === "weekday")?.value ?? "";
      const wdMap: Record<string, number> = {
        Sun: 0,
        Mon: 1,
        Tue: 2,
        Wed: 3,
        Thu: 4,
        Fri: 5,
        Sat: 6,
      };
      localWeekday = wdMap[wdStr] ?? this.gregorianDate.getUTCDay();
      localHour = get("hour") % 24; // hour12:false can return 24 for midnight

      // Build a UTC-midnight Date matching the local calendar date so that
      // the BanglaDate constructor computes the correct Bangla fields.
      const localGreg = new Date(
        Date.UTC(get("year"), get("month") - 1, get("day"))
      );
      const localBD = new BanglaDate(localGreg, this.language);
      banglaYear = localBD.banglaYear;
      banglaMonthIndex = localBD.banglaMonthIndex;
      banglaDay = localBD.banglaDay;
    }

    // ── 3. Build formatter ─────────────────────────────────────────────────
    // Pass the requested timezone straight through — Intl will render time
    // fields (hour, minute, second, dayPeriod, timeZoneName) in local time.
    const formatter = new Intl.DateTimeFormat(
      resolvedLocale.startsWith("en") ? resolvedLocale : "en-US",
      { ...options, timeZone: tz }
    );

    return formatter
      .formatToParts(this.gregorianDate)
      .map((part) => {
        switch (part.type) {
          // ── year ──────────────────────────────────────────────────────────
          case "year": {
            // Respect 2-digit vs. 4-digit format requested by the caller.
            const byStr =
              part.value.length <= 2
                ? String(banglaYear % 100).padStart(part.value.length, "0")
                : String(banglaYear);
            return numberToNumber(byStr, localeKey);
          }

          // ── month ─────────────────────────────────────────────────────────
          case "month":
            if (/\d/.test(part.value)) {
              // Numeric month — preserve zero-padding from the original part.
              const mStr = String(banglaMonthIndex + 1).padStart(
                part.value.length,
                "0"
              );
              return numberToNumber(mStr, localeKey);
            }
            // Named month — use explicit options rather than guessing from
            // value length (avoids "May" being misidentified as "short").
            {
              const mOpt = options?.month;
              const fmt =
                mOpt === "narrow"
                  ? "narrow"
                  : mOpt === "long" || (!mOpt && part.value.length > 3)
                  ? "long"
                  : "short";
              return this.getFormattedMonthName(fmt);
            }

          // ── day ───────────────────────────────────────────────────────────
          case "day": {
            const dStr = String(banglaDay).padStart(part.value.length, "0");
            return numberToNumber(dStr, localeKey);
          }

          // ── weekday ───────────────────────────────────────────────────────
          case "weekday": {
            const wdOpt = options?.weekday;
            const wdFmt =
              wdOpt === "narrow"
                ? "narrow"
                : wdOpt === "long" || (!wdOpt && part.value.length > 3)
                ? "long"
                : "short";
            return this.getWeekDayFormat(wdFmt, localWeekday);
          }

          // ── era ───────────────────────────────────────────────────────────
          case "era":
            return this.getEra();

          // ── time fields (already localised by Intl, just re-localise) ─────
          case "hour":
          case "minute":
          case "second":
            return numberToNumber(part.value, localeKey);

          case "dayPeriod":
            // Derive AM/PM from the timezone-local hour.
            return localHour >= 12
              ? this.language === "bn"
                ? "অপরাহ্ণ"
                : this.language === "hi"
                ? "अपराह्न"
                : "PM"
              : this.language === "bn"
              ? "পূর্বাহ্ণ"
              : this.language === "hi"
              ? "पूर्वाह्न"
              : "AM";

          default:
            // Handle fractionalSecond (not in all TS lib versions) + literals,
            // separators, timeZoneName, etc.
            if ((part.type as string) === "fractionalSecond") {
              return numberToNumber(part.value, localeKey);
            }
            return part.value;
        }
      })
      .join("");
  }

  /**
   * Returns the **ordinal form** of the Bangla day-of-month in the
   * instance's language.
   *
   * Rules by language:
   *
   * **English (`en`)** — standard English ordinal suffixes:
   * - `1st`, `2nd`, `3rd`, `4th`–`20th` → `th`
   * - Exception: `11th`, `12th`, `13th` always use `th` (not `st`/`nd`/`rd`)
   *
   * **Bengali (`bn`)** — traditional forms:
   * - 1 → পহেলা, 2 → দোসরা, 3 → তেসরা, 4 → চৌঠা
   * - 5–18 → `Nই` (e.g. ৫ই, ১৫ই)
   * - 19–31 → `Nশে` (e.g. ১৯শে, ৩১শে)
   *
   * **Hindi (`hi`)** — traditional ordinal forms:
   * - 1 → पहला, 2 → दूसरा, 3 → तीसरा, 4 → चौथा
   * - 5–20 → `Nवाँ` (e.g. ५वाँ, २०वाँ)
   * - 21+ → `Nवें` (e.g. २१वें, ३१वें)
   *
   * Digits in the compound forms (e.g. `৫ই`) are localised to the
   * instance's script.
   *
   * @returns The ordinal day string in the instance's language.
   *
   * @example
   * BanglaDate.fromBanglaDate(1432, 1, 1,  'en').getOrdinalDate(); // "1st"
   * BanglaDate.fromBanglaDate(1432, 1, 2,  'en').getOrdinalDate(); // "2nd"
   * BanglaDate.fromBanglaDate(1432, 1, 11, 'en').getOrdinalDate(); // "11th"
   * BanglaDate.fromBanglaDate(1432, 1, 1,  'bn').getOrdinalDate(); // "পহেলা"
   * BanglaDate.fromBanglaDate(1432, 1, 5,  'bn').getOrdinalDate(); // "৫ই"
   * BanglaDate.fromBanglaDate(1432, 1, 20, 'bn').getOrdinalDate(); // "২০শে"
   * BanglaDate.fromBanglaDate(1432, 1, 1,  'hi').getOrdinalDate(); // "पहला"
   * BanglaDate.fromBanglaDate(1432, 1, 5,  'hi').getOrdinalDate(); // "५वाँ"
   */
  getOrdinalDate(): string {
    const d = this.banglaDay;
    if (this.language === "bn") {
      const special: Record<number, string> = {
        1: "পহেলা",
        2: "দোসরা",
        3: "তেসরা",
        4: "চৌঠা",
      };
      if (special[d]) return special[d];
      const dbn = numberToNumber(d, "bn");
      return d >= 5 && d <= 18 ? `${dbn}ই` : `${dbn}শে`;
    }
    if (this.language === "hi") {
      const special: Record<number, string> = {
        1: "पहला",
        2: "दूसरा",
        3: "तीसरा",
        4: "चौथा",
      };
      if (special[d]) return special[d];
      const dhi = numberToNumber(d, "hi");
      return d <= 20 ? `${dhi}वाँ` : `${dhi}वें`;
    }
    // English
    const j = d % 10,
      k = d % 100;
    const suffix =
      k === 11 || k === 12 || k === 13
        ? "th"
        : j === 1
        ? "st"
        : j === 2
        ? "nd"
        : j === 3
        ? "rd"
        : "th";
    return `${d}${suffix}`;
  }

  /**
   * Returns the weekday name for the current Gregorian UTC day of the week,
   * in the instance's language and the requested display format.
   *
   * | Format   | en (Sun)    | bn (Sun)    | hi (Sun)    |
   * |----------|-------------|-------------|-------------|
   * | `long`   | `"Sunday"`  | `"রবিবার"`  | `"रविवार"` |
   * | `short`  | `"Sun"`     | `"রবি"`     | `"रवि"`    |
   * | `narrow` | `"S"`       | `"র"`       | `"र"`      |
   *
   * Called internally by `toDateString()`, `format()` (for `WWWW` / `WWW`),
   * and `_applyLocale()` (for weekday locale output).
   *
   * @param format - Display format. Defaults to `"long"`.
   * @param dayIndex - Optional 0-based weekday index (0=Sunday…6=Saturday).
   *   When omitted, the UTC weekday of the underlying timestamp is used.
   *   Pass an explicit value when formatting in a non-UTC timezone where
   *   the local weekday may differ from the UTC weekday.
   * @returns The weekday name string.
   * @internal
   */
  private getWeekDayFormat(
    format: "long" | "short" | "narrow" = "long",
    dayIndex?: number
  ): string {
    const weekDays: Record<
      "long" | "short" | "narrow",
      Record<Language, string[]>
    > = {
      long: {
        en: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        bn: [
          "রবিবার",
          "সোমবার",
          "মঙ্গলবার",
          "বুধবার",
          "বৃহস্পতিবার",
          "শুক্রবার",
          "শনিবার",
        ],
        hi: [
          "रविवार",
          "सोमवार",
          "मंगलवार",
          "बुधवार",
          "गुरुवार",
          "शुक्रवार",
          "शनिवार",
        ],
      },
      short: {
        en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        bn: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"],
        hi: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
      },
      narrow: {
        en: ["S", "M", "T", "W", "T", "F", "S"],
        bn: ["র", "সো", "ম", "বু", "বৃ", "শু", "শ"],
        hi: ["र", "सो", "मं", "बु", "गु", "शु", "श"],
      },
    };
    const gDay = dayIndex ?? this.gregorianDate.getUTCDay();
    return weekDays[format][this.language][gDay];
  }
}

export default BanglaDate;
