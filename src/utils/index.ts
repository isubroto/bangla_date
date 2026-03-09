type NumberInWords = {
  [key: number]: string;
};

type NumbersInWords = {
  en: NumberInWords;
  bn: NumberInWords;
  hi: NumberInWords;
};

/**
 * Converts an integer to its natural-language word equivalent in English,
 * Bengali, or Hindi.
 *
 * - **English** uses the short-scale system: thousand / million / billion.
 * - **Bengali & Hindi** use the South-Asian denomination system:
 *   হাজার/हज़ार (1,000) → লাখ/लाख (1,00,000) → কোটি/करोड़ (1,00,00,000).
 *   Crore-level values are handled recursively, so very large numbers such
 *   as 10,000,000,000 correctly render as "এক হাজার কোটি" / "एक हज़ार करोड़".
 *
 * @param num - An integer (positive, negative, or zero). Throws if `num`
 *   is not an integer (i.e. `Number.isInteger(num)` is `false`).
 * @param language - Target language for word output.
 *   - `"en"` (default) — English words, e.g. `"twenty-one"`
 *   - `"bn"` — Bengali words, e.g. `"একাশ"`
 *   - `"hi"` — Hindi words, e.g. `"इक्कीस"`
 * @returns The word representation as a string.
 * @throws {Error} When `num` is not an integer.
 *
 * @example
 * numberToWords(21, 'en');       // "twenty-one"
 * numberToWords(21, 'bn');       // "একাশ"
 * numberToWords(21, 'hi');       // "इक्कीस"
 * numberToWords(1000, 'en');     // "one thousand"
 * numberToWords(100000, 'bn');   // "এক লাখ"
 * numberToWords(-5, 'en');       // "-five"
 * numberToWords(0, 'bn');        // "শূন্য"
 */
export const numberToWords = (
  num: number,
  language: keyof NumbersInWords = "en"
): string => {
  if (!Number.isInteger(num)) {
    throw new Error(`numberToWords only supports integers, got ${num}`);
  }
  const numbersInWords: NumbersInWords = {
    en: {
      0: "zero",
      1: "one",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
      10: "ten",
      11: "eleven",
      12: "twelve",
      13: "thirteen",
      14: "fourteen",
      15: "fifteen",
      16: "sixteen",
      17: "seventeen",
      18: "eighteen",
      19: "nineteen",
      20: "twenty",
      30: "thirty",
      40: "forty",
      50: "fifty",
      60: "sixty",
      70: "seventy",
      80: "eighty",
      90: "ninety",
      100: "hundred",
      1000: "thousand",
    },
    bn: {
      0: "শূন্য",
      1: "এক",
      2: "দুই",
      3: "তিন",
      4: "চার",
      5: "পাঁচ",
      6: "ছয়",
      7: "সাত",
      8: "আট",
      9: "নয়",
      10: "দশ",
      11: "এগারো",
      12: "বারো",
      13: "তেরো",
      14: "চোদ্দো",
      15: "পনেরো",
      16: "ষোলো",
      17: "সতেরো",
      18: "আঠারো",
      19: "উনিশ",
      20: "বিশ",
      21: "একুশ",
      22: "বাইশ",
      23: "তেইশ",
      24: "চব্বিশ",
      25: "পঁচিশ",
      26: "ছাব্বিশ",
      27: "সাতাশ",
      28: "আটাশ",
      29: "উনত্রিশ",
      30: "ত্রিশ",
      31: "একত্রিশ",
      32: "বত্রিশ",
      33: "তেত্রিশ",
      34: "চৌত্রিশ",
      35: "পঁয়ত্রিশ",
      36: "ছত্রিশ",
      37: "সাতত্রিশ",
      38: "আটত্রিশ",
      39: "উনচল্লিশ",
      40: "চল্লিশ",
      41: "একচল্লিশ",
      42: "বিয়াল্লিশ",
      43: "তেতাল্লিশ",
      44: "চৌচল্লিশ",
      45: "পঁয়তাল্লিশ",
      46: "ছেচল্লিশ",
      47: "সাতচল্লিশ",
      48: "আটচল্লিশ",
      49: "উনপঞ্চাশ",
      50: "পঞ্চাশ",
      51: "একান্ন",
      52: "বায়ান্ন",
      53: "তেপান্ন",
      54: "চৌপান্ন",
      55: "পঞ্চান্ন",
      56: "ছাপান্ন",
      57: "সাতান্ন",
      58: "আটান্ন",
      59: "উনষাট",
      60: "ষাট",
      61: "একষট্টি",
      62: "বাষট্টি",
      63: "তেষট্টি",
      64: "চৌষট্টি",
      65: "পঁয়ষট্টি",
      66: "ছেষট্টি",
      67: "সাতষট্টি",
      68: "আটষট্টি",
      69: "উনসত্তর",
      70: "সত্তর",
      71: "একাত্তর",
      72: "বাহাত্তর",
      73: "তেহাত্তর",
      74: "চুয়াত্তর",
      75: "পঁচাত্তর",
      76: "ছিয়াত্তর",
      77: "সাতাত্তর",
      78: "আটাত্তর",
      79: "উনআশি",
      80: "আশি",
      81: "একাশি",
      82: "বিরাশি",
      83: "তিরাশি",
      84: "চুরাশি",
      85: "পঁচাশি",
      86: "ছিয়াশি",
      87: "সাতাশি",
      88: "আটাশি",
      89: "উননব্বই",
      90: "নব্বই",
      91: "একানব্বই",
      92: "বিরানব্বই",
      93: "তিরানব্বই",
      94: "চুরানব্বই",
      95: "পঁচানব্বই",
      96: "ছিয়ানব্বই",
      97: "সাতানব্বই",
      98: "আটানব্বই",
      99: "নিরানব্বই",
      100: "শত",
      1000: "হাজার",
    },
    hi: {
      0: "शून्य",
      1: "एक",
      2: "दो",
      3: "तीन",
      4: "चार",
      5: "पाँच",
      6: "छह",
      7: "सात",
      8: "आठ",
      9: "नौ",
      10: "दस",
      11: "ग्यारह",
      12: "बारह",
      13: "तेरह",
      14: "चौदह",
      15: "पंद्रह",
      16: "सोलह",
      17: "सत्रह",
      18: "अठारह",
      19: "उन्नीस",
      20: "बीस",
      21: "इक्कीस",
      22: "बाईस",
      23: "तेईस",
      24: "चौबीस",
      25: "पच्चीस",
      26: "छब्बीस",
      27: "सत्ताईस",
      28: "अट्ठाईस",
      29: "उनतीस",
      30: "तीस",
      31: "इकतीस",
      32: "बत्तीस",
      33: "तैंतीस",
      34: "चौंतीस",
      35: "पैंतीस",
      36: "छत्तीस",
      37: "सैंतीस",
      38: "अड़तीस",
      39: "उनतालीस",
      40: "चालीस",
      41: "इकतालीस",
      42: "बयालीस",
      43: "तैंतालीस",
      44: "चवालीस",
      45: "पैंतालीस",
      46: "छयालीस",
      47: "सैंतालीस",
      48: "अड़तालीस",
      49: "उनचास",
      50: "पचास",
      51: "इक्यावन",
      52: "बावन",
      53: "तिरपन",
      54: "चौवन",
      55: "पचपन",
      56: "छप्पन",
      57: "सत्तावन",
      58: "अट्ठावन",
      59: "उनसठ",
      60: "साठ",
      61: "इकसठ",
      62: "बासठ",
      63: "तिरसठ",
      64: "चौंसठ",
      65: "पैंसठ",
      66: "छयासठ",
      67: "सड़सठ",
      68: "अड़सठ",
      69: "उनहत्तर",
      70: "सत्तर",
      71: "इकहत्तर",
      72: "बहत्तर",
      73: "तिहत्तर",
      74: "चौहत्तर",
      75: "पचहत्तर",
      76: "छिहत्तर",
      77: "सतहत्तर",
      78: "अठहत्तर",
      79: "उन्यासी",
      80: "अस्सी",
      81: "इक्यासी",
      82: "बयासी",
      83: "तिरासी",
      84: "चौरासी",
      85: "पचासी",
      86: "छियासी",
      87: "सत्तासी",
      88: "अट्ठासी",
      89: "नवासी",
      90: "नब्बे",
      91: "इक्यानवे",
      92: "बानवे",
      93: "तिरानवे",
      94: "चौरानवे",
      95: "पचानवे",
      96: "छानवे",
      97: "सत्तानवे",
      98: "अट्ठानवे",
      99: "निन्यानवे",
      100: "सौ",
      1000: "हज़ार",
    },
  };

  // Helper function to convert number to words for numbers below 100
  const convertBelowHundred = (
    num: number,
    language: keyof typeof numbersInWords
  ): string => {
    // All values 0-99 have direct entries in the map (bn & hi have each unique
    // compound word; en falls back to tens+ones construction for values > 20
    // that are not multiples of 10).
    if (num in numbersInWords[language]) {
      return numbersInWords[language][num];
    }
    // English only: compose "twenty-one", "thirty-two", etc.
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;
    return `${numbersInWords[language][tens]}-${numbersInWords[language][ones]}`;
  };

  // Helper function to convert number to words for numbers below 1000
  const convertBelowThousand = (
    num: number,
    language: keyof typeof numbersInWords
  ): string => {
    if (num < 100) return convertBelowHundred(num, language);

    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    let hundredWord: string;
    if (language === "bn") {
      // Bengali (colloquial): "একশো", "দুইশো", "তিনশো" …
      hundredWord = `${numbersInWords[language][hundreds]}শো`;
    } else if (language === "hi") {
      // Hindi: "एक सौ", "दो सौ", etc.
      hundredWord = `${numbersInWords[language][hundreds]} ${numbersInWords[language][100]}`;
    } else {
      // English: "one hundred", "two hundred", etc.
      hundredWord =
        hundreds === 1
          ? `one ${numbersInWords[language][100]}`
          : `${convertBelowHundred(hundreds, language)} ${
              numbersInWords[language][100]
            }`;
    }

    return remainder
      ? `${hundredWord} ${convertBelowHundred(remainder, language)}`
      : hundredWord;
  };

  if (num === 0) return numbersInWords[language][0];
  if (num < 0) return `-${numberToWords(-num, language)}`;
  if (num < 1000) return convertBelowThousand(num, language);

  // Lakh (1,00,000) and Crore (1,00,00,000) for Bengali/Hindi; Million for English
  if (language === "en") {
    if (num < 1_000_000) {
      const thousands = Math.floor(num / 1000);
      const remainder = num % 1000;
      return remainder
        ? `${convertBelowThousand(thousands, language)} ${
            numbersInWords[language][1000]
          } ${convertBelowThousand(remainder, language)}`
        : `${convertBelowThousand(thousands, language)} ${
            numbersInWords[language][1000]
          }`;
    }
    if (num < 1_000_000_000) {
      const millions = Math.floor(num / 1_000_000);
      const remainder = num % 1_000_000;
      return remainder
        ? `${convertBelowThousand(millions, language)} million ${numberToWords(
            remainder,
            language
          )}`
        : `${convertBelowThousand(millions, language)} million`;
    }
    const billions = Math.floor(num / 1_000_000_000);
    const remainder = num % 1_000_000_000;
    return remainder
      ? `${convertBelowThousand(billions, language)} billion ${numberToWords(
          remainder,
          language
        )}`
      : `${convertBelowThousand(billions, language)} billion`;
  }

  // Bengali / Hindi: use lakh and crore denominations
  const lakhWord = language === "bn" ? "লাখ" : "लाख";
  const croreWord = language === "bn" ? "কোটি" : "करोड़";

  if (num < 100_000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return remainder
      ? `${convertBelowThousand(thousands, language)} ${
          numbersInWords[language][1000]
        } ${convertBelowThousand(remainder, language)}`
      : `${convertBelowThousand(thousands, language)} ${
          numbersInWords[language][1000]
        }`;
  }

  if (num < 10_000_000) {
    const lakhs = Math.floor(num / 100_000);
    const remainder = num % 100_000;
    return remainder
      ? `${convertBelowThousand(lakhs, language)} ${lakhWord} ${numberToWords(
          remainder,
          language
        )}`
      : `${convertBelowThousand(lakhs, language)} ${lakhWord}`;
  }

  const crores = Math.floor(num / 10_000_000);
  const remainder = num % 10_000_000;
  // Use recursive numberToWords for crores so values >= 1000 crore are
  // handled correctly (e.g. 10,000,000,000 → "এক হাজার কোটি").
  return remainder
    ? `${numberToWords(crores, language)} ${croreWord} ${numberToWords(
        remainder,
        language
      )}`
    : `${numberToWords(crores, language)} ${croreWord}`;
};

/**
 * Replaces every ASCII digit (0–9) in a number or string with the
 * equivalent digit character in the target language/script.
 *
 * This is the low-level utility used by all `BanglaDate` formatting and
 * output methods to localise numeric output. Passing `"en"` is a no-op
 * (digits remain 0–9).
 *
 * @param num - The value to localise. Accepts a `number` or a `string`
 *   that may contain digits anywhere (e.g. formatted date strings, time
 *   strings, ISO strings). Non-digit characters are passed through unchanged.
 * @param language - Target script for digit substitution.
 *   - `"en"` (default) — ASCII digits (no change)
 *   - `"bn"` — Bengali digits ০১২৩৪৫৬৭৮৯
 *   - `"hi"` — Devanagari digits ०१२३४५६७८९
 * @returns The input with all ASCII digits replaced by the target script's digits.
 *
 * @example
 * numberToNumber(2025, 'bn');          // "২০২৫"
 * numberToNumber('14/4/1432', 'bn');   // "১৪/৪/১৪৩২"
 * numberToNumber('08:30:00', 'hi');    // "०८:८०:००"
 * numberToNumber(42, 'en');            // "42" (no change)
 */
export const numberToNumber = (
  num: number | string,
  language: keyof NumbersInWords = "en"
) => {
  const numbersInNumber: NumbersInWords = {
    en: {
      0: "0",
      1: "1",
      2: "2",
      3: "3",
      4: "4",
      5: "5",
      6: "6",
      7: "7",
      8: "8",
      9: "9",
    },
    bn: {
      0: "০",
      1: "১",
      2: "২",
      3: "৩",
      4: "৪",
      5: "৫",
      6: "৬",
      7: "৭",
      8: "৮",
      9: "৯",
    },
    hi: {
      0: "०",
      1: "१",
      2: "२",
      3: "३",
      4: "४",
      5: "५",
      6: "६",
      7: "७",
      8: "८",
      9: "९",
    },
  };

  return num
    .toString()
    .replace(/\d/g, (digit) => numbersInNumber[language][parseInt(digit)]);
};

/**
 * Timezone offsets in fractional hours (e.g. 5.5 = UTC+5:30).
 * Ambiguous abbreviations are resolved toward the most common / South-Asian context:
 *   IST  → India Standard Time  (+5:30)   not Ireland (+1) or Israel (+2)
 *   AST  → Arabia Standard Time (+3)      not Atlantic (-4)
 *   CST  → Central Standard Time (-6, US/Canada)  — use CST_CN alias for China (+8)
 *   GST  → Gulf Standard Time   (+4)      not South Georgia (-2) — use GST_SG alias
 *   AMT  → Amazon Time          (-4)      not Armenia (+4)
 */
export const TIME_ZONE_OFFSETS: Record<string, number> = {
  // ── UTC / GMT ──────────────────────────────────────────────────────────
  UTC: 0,
  GMT: 0,

  // ── UTC−12 ─────────────────────────────────────────────────────────────
  IDLW: -12, // International Date Line West
  BIT: -12, // Baker Island Time

  // ── UTC−11 ─────────────────────────────────────────────────────────────
  NUT: -11, // Niue Time
  SST: -11, // Samoa Standard Time
  MIT: -11, // Midway Islands Time

  // ── UTC−10 ─────────────────────────────────────────────────────────────
  HST: -10, // Hawaii Standard Time
  HAST: -10, // Hawaii–Aleutian Standard Time
  TAHT: -10, // Tahiti Time
  CKT: -10, // Cook Island Time

  // ── UTC−9:30 ───────────────────────────────────────────────────────────
  MART: -9.5, // Marquesas Islands Time

  // ── UTC−9 ──────────────────────────────────────────────────────────────
  AKST: -9, // Alaska Standard Time
  GAMT: -9, // Gambier Islands Time
  HADT: -9, // Hawaii–Aleutian Daylight Time

  // ── UTC−8 ──────────────────────────────────────────────────────────────
  PST: -8, // Pacific Standard Time (US/Canada)
  AKDT: -8, // Alaska Daylight Time

  // ── UTC−7 ──────────────────────────────────────────────────────────────
  MST: -7, // Mountain Standard Time (US/Canada/Mexico)
  PDT: -7, // Pacific Daylight Time

  // ── UTC−6 ──────────────────────────────────────────────────────────────
  CST: -6, // Central Standard Time (US/Canada) — kept as US default
  MDT: -6, // Mountain Daylight Time

  // ── UTC−5 ──────────────────────────────────────────────────────────────
  EST: -5, // Eastern Standard Time (US/Canada)
  CDT: -5, // Central Daylight Time
  PET: -5, // Peru Time
  COT: -5, // Colombia Time
  ECT: -5, // Ecuador Time
  COST: -5, // Colombia Summer Time

  // ── UTC−4:30 ───────────────────────────────────────────────────────────
  VET: -4.5, // Venezuela Time

  // ── UTC−4 ──────────────────────────────────────────────────────────────
  EDT: -4, // Eastern Daylight Time
  ADT: -3, // Atlantic Daylight Time
  AST_AR: -4, // Atlantic Standard Time (Americas)
  BOT: -4, // Bolivia Time
  AMT: -4, // Amazon Time (Brazil)
  GYT: -4, // Guyana Time
  PYT: -4, // Paraguay Time

  // ── UTC−3:30 ───────────────────────────────────────────────────────────
  NST: -3.5, // Newfoundland Standard Time
  NDT: -2.5, // Newfoundland Daylight Time

  // ── UTC−3 ──────────────────────────────────────────────────────────────
  BRT: -3, // Brasilia Time
  ART: -3, // Argentina Time
  UYT: -3, // Uruguay Time
  SRT: -3, // Suriname Time
  GFT: -3, // French Guiana Time
  ROTT: -3, // Rothera Research Station Time
  WGT: -3, // West Greenland Time
  PMST: -3, // St. Pierre & Miquelon Standard Time
  PNST: -8.5, // Pitcairn Standard Time (actually −8:30)

  // ── UTC−2 ──────────────────────────────────────────────────────────────
  BRST: -2, // Brasilia Summer Time
  FNT: -2, // Fernando de Noronha Time
  UYST: -2, // Uruguay Summer Time
  WGST: -2, // West Greenland Summer Time
  PYDT: -3, // Paraguay Daylight Time

  // ── UTC−1 ──────────────────────────────────────────────────────────────
  AZOT: -1, // Azores Standard Time
  CVT: -1, // Cape Verde Time
  EGT: -1, // East Greenland Time
  AZOST: 0, // Azores Summer Time (≡ UTC)
  EGST: 0, // East Greenland Summer Time

  // ── UTC+0 ──────────────────────────────────────────────────────────────
  WET: 0, // Western European Time (Portugal, UK winter)
  WT: 0, // West Africa Time (alternative)

  // ── UTC+1 ──────────────────────────────────────────────────────────────
  CET: 1, // Central European Time
  WAT: 1, // West Africa Time (Nigeria, etc.)
  MET: 1, // Middle European Time
  IST_IE: 1, // Ireland Standard Time
  WEST: 1, // Western European Summer Time
  BST_UK: 1, // British Summer Time (not used here; alias only)

  // ── UTC+2 ──────────────────────────────────────────────────────────────
  EET: 2, // Eastern European Time
  CEST: 2, // Central European Summer Time
  CAT: 2, // Central Africa Time (Harare, Lusaka)
  SAST: 2, // South Africa Standard Time
  IST_IL: 2, // Israel Standard Time
  FLST: 2, // Falkland Islands Summer Time

  // ── UTC+3 ──────────────────────────────────────────────────────────────
  EEST: 3, // Eastern European Summer Time
  MSK: 3, // Moscow Standard Time (Russia)
  EAT: 3, // East Africa Time (Kenya, Tanzania, Uganda)
  AST: 3, // Arabia Standard Time (Saudi Arabia, Iraq, Kuwait)
  TRT: 3, // Turkey Time
  SYOT: 3, // Syowa Station Time (Antarctica)
  MSD: 4, // Moscow Daylight (historical; now MSK is permanent)

  // ── UTC+3:30 ───────────────────────────────────────────────────────────
  IRST: 3.5, // Iran Standard Time
  IRDT: 4.5, // Iran Daylight Time

  // ── UTC+4 ──────────────────────────────────────────────────────────────
  GST: 4, // Gulf Standard Time (UAE, Oman) — primary interpretation
  GST_SG: -2, // South Georgia Time (alias to disambiguate)
  MUT: 4, // Mauritius Time
  RET: 4, // Réunion Time
  SCT: 4, // Seychelles Time
  SAMT: 4, // Samara Time (Russia)
  GET: 4, // Georgia Standard Time
  AZT: 4, // Azerbaijan Time
  AZST: 5, // Azerbaijan Summer Time

  // ── UTC+4:30 ───────────────────────────────────────────────────────────
  AFT: 4.5, // Afghanistan Time

  // ── UTC+5 ──────────────────────────────────────────────────────────────
  PKT: 5, // Pakistan Standard Time
  UZT: 5, // Uzbekistan Time
  TJT: 5, // Tajikistan Time
  TMT: 5, // Turkmenistan Time
  MVT: 5, // Maldives Time
  YEKT: 5, // Yekaterinburg Time (Russia)
  AQTT: 5, // Aqtau/Aktobe Time (Kazakhstan)

  // ── UTC+5:30 ───────────────────────────────────────────────────────────
  IST: 5.5, // India Standard Time (primary — most used in this library)
  SLT: 5.5, // Sri Lanka Time

  // ── UTC+5:45 ───────────────────────────────────────────────────────────
  NPT: 5.75, // Nepal Time

  // ── UTC+6 ──────────────────────────────────────────────────────────────
  BST: 6, // Bangladesh Standard Time (UTC+6) ← primary use in this library
  BTT: 6, // Bhutan Time
  ALMT: 6, // Alma-Ata Time (Kazakhstan)
  OMST: 6, // Omsk Time (Russia)
  VOST: 6, // Vostok Station Time (Antarctica)
  IOT: 6, // Indian Ocean Time (Chagos)

  // ── UTC+6:30 ───────────────────────────────────────────────────────────
  MMT: 6.5, // Myanmar Time
  CCT: 6.5, // Cocos Islands Time

  // ── UTC+7 ──────────────────────────────────────────────────────────────
  WIB: 7, // Western Indonesian Time
  ICT: 7, // Indochina Time (Vietnam, Thailand, Laos, Cambodia)
  THA: 7, // Thailand Standard Time
  KRAT: 7, // Krasnoyarsk Time (Russia)
  HOVT: 7, // Hovd Time (Mongolia)

  // ── UTC+8 ──────────────────────────────────────────────────────────────
  CST_CN: 8, // China Standard Time (alias to avoid ambiguity)
  HKT: 8, // Hong Kong Time
  SGT: 8, // Singapore Time
  MYT: 8, // Malaysia Time
  AWST: 8, // Australian Western Standard Time (Perth)
  BNT: 8, // Brunei Darussalam Time
  ULAT: 8, // Ulaanbaatar Time (Mongolia)
  PHST: 8, // Philippine Standard Time
  IRKT: 8, // Irkutsk Time (Russia)
  WST: 8, // Western Samoa Time (historical; use WSST for modern)

  // ── UTC+8:45 ───────────────────────────────────────────────────────────
  CWST: 8.75, // Southeastern Western Australia Standard Time

  // ── UTC+9 ──────────────────────────────────────────────────────────────
  JST: 9, // Japan Standard Time
  KST: 9, // Korea Standard Time
  TLT: 9, // East Timor Time
  YAKT: 9, // Yakutsk Time (Russia)
  WIT: 9, // Eastern Indonesian Time
  PWT: 9, // Palau Time

  // ── UTC+9:30 ───────────────────────────────────────────────────────────
  ACST: 9.5, // Australian Central Standard Time
  ACDT: 10.5, // Australian Central Daylight Time

  // ── UTC+10 ─────────────────────────────────────────────────────────────
  AEST: 10, // Australian Eastern Standard Time
  ChST: 10, // Chamorro Standard Time (Guam, CNMI)
  PGT: 10, // Papua New Guinea Time
  VLAT: 10, // Vladivostok Time (Russia)
  TRUT: 10, // Truk Time (Chuuk, Micronesia)

  // ── UTC+10:30 ──────────────────────────────────────────────────────────
  LHST: 10.5, // Lord Howe Standard Time

  // ── UTC+11 ─────────────────────────────────────────────────────────────
  AEDT: 11, // Australian Eastern Daylight Time
  SBT: 11, // Solomon Islands Time
  NCT: 11, // New Caledonia Time
  NFT: 11, // Norfolk Island Time
  PONT: 11, // Pohnpei Standard Time (Micronesia)
  KOST: 11, // Kosrae Time (Micronesia)
  LHDT: 11, // Lord Howe Daylight Time
  VLAST: 11, // Vladivostok Summer Time (historical)

  // ── UTC+12 ─────────────────────────────────────────────────────────────
  NZST: 12, // New Zealand Standard Time
  FJT: 12, // Fiji Time
  TVT: 12, // Tuvalu Time
  MHT: 12, // Marshall Islands Time
  GILT: 12, // Gilbert Islands Time (Kiribati)
  ANAT: 12, // Anadyr Time (Russia)
  PETT: 12, // Kamchatka Time (Russia)
  WAKT: 12, // Wake Island Time
  NRUT: 12, // Nauru Time

  // ── UTC+12:45 ──────────────────────────────────────────────────────────
  CHAST: 12.75, // Chatham Islands Standard Time

  // ── UTC+13 ─────────────────────────────────────────────────────────────
  NZDT: 13, // New Zealand Daylight Time
  TOT: 13, // Tonga Time
  WSST: 13, // Samoa Standard Time (Samoa/American Samoa post-2011)
  TKT: 13, // Tokelau Time
  PHOT: 13, // Phoenix Islands Time (Kiribati)

  // ── UTC+13:45 ──────────────────────────────────────────────────────────
  CHADT: 13.75, // Chatham Islands Daylight Time

  // ── UTC+14 ─────────────────────────────────────────────────────────────
  LINT: 14, // Line Islands Time (Kiribati — easternmost)
  YEKST: 6, // Yekaterinburg Summer Time (Russia, historical)
  OMSST: 7, // Omsk Summer Time (historical)
  IRKST: 9, // Irkutsk Summer Time (historical)
  YAKST: 10, // Yakutsk Summer Time (historical)
  KRAST: 8, // Krasnoyarsk Summer Time (historical)
  ANAST: 12, // Anadyr Summer Time (historical)
  PETST: 12, // Kamchatka Summer Time (historical)
  FJST: 13, // Fiji Summer Time
  AWDT: 9, // Australian Western Daylight Time (historical, not officially observed)
};

/**
 * Replaces Gregorian numeric fields inside a pre-formatted locale string
 * with the corresponding Bangla calendar values.
 *
 * This was used by `BanglaDate.toLocaleString()` / `toLocaleDateString()` to
 * substitute the year, month, and day in an `Intl.DateTimeFormat` output
 * string. Since v1.7 `BanglaDate._applyLocale()` uses
 * `Intl.DateTimeFormat.formatToParts()` directly and no longer calls this
 * helper, but the function remains exported for any external callers.
 *
 * @deprecated Since v1.7.0 \u2014 `BanglaDate._applyLocale` now uses
 *   `Intl.DateTimeFormat.formatToParts()` internally. This function may be
 *   removed in the next major release. Migrate to `BanglaDate.format()` or
 *   `BanglaDate.toLocaleString()` instead.
 *
 * @param banglaDateStr - An ISO-like string in the form
 *   `\"YYYY-MM-DDThh:mm:ss.mmmZ\"` where `YYYY-MM-DD` are Bangla calendar
 *   values (as produced by `BanglaDate.toISOString()`).
 * @param templateStr - A locale-formatted date string (e.g. from
 *   `Intl.DateTimeFormat`) that contains the Gregorian values to be replaced.\n *   May optionally contain a timezone label (e.g. `\"GMT+6\"`, `\"BST\"`)
 *   to localise the time component.
 * @param gregorianRef - Optional. The original Gregorian `Date` that was
 *   used to generate `templateStr`. When supplied, replacement uses exact
 *   field matching to avoid false positives on ambiguous substrings.
 * @returns A new string equal to `templateStr` with Gregorian year, month,
 *   day, and time fields replaced by their Bangla equivalents.
 * @throws {Error} If `banglaDateStr` cannot be parsed (missing `YYYY-MM-DD`
 *   prefix or missing time component).
 *
 * @example
 * // Convert a Gregorian locale string to Bangla calendar values:
 * const bd = BanglaDate.fromBanglaDate(1432, 1, 14);
 * formatBanglaDateToMatchTemplate(
 *   bd.toISOString(),          // \"1432-01-14T00:00:00.000Z\"
 *   '4/14/2025, 12:00:00 AM',  // Gregorian en-US formatted string
 *   bd.toGregorian()
 * );
 * // => '1/14/1432, 12:00:00 AM'
 */
export function formatBanglaDateToMatchTemplate(
  banglaDateStr: string,
  templateStr: string,
  gregorianRef?: Date
): string {
  // 1. Parse Bangla date components
  const [banglaDatePart, timePartRaw] = banglaDateStr.split(" ");
  const [bYear, bMonth, bDay] = banglaDatePart.split("-");
  if (!bYear || !bMonth || !bDay) throw new Error("Invalid Bangla date");

  // 2. Try to extract timezone (optional)
  const timezoneRegex =
    /\b(GMT[+-]?\d+(?:\.\d+)?|UTC[+-]?\d+(?:\.\d+)?|UTC|GMT|IDLW|BIT|NUT|SST|MIT|TAHT|CKT|MART|HST|AKST|AKDT|GAMT|HAST|HADT|PST|PDT|MST|MDT|CST|CDT|EST|EDT|PET|COT|ECT|COST|VET|AST|ADT|BOT|AMT|GYT|PYT|PYDT|NST|NDT|BRT|ART|UYT|UYST|SRT|GFT|ROTT|WGT|WGST|PNST|BRST|FNT|GST_SG|AZOT|AZOST|CVT|WET|WEST|WT|EGT|EGST|CET|CEST|WAT|WEST|MET|IST_IE|EET|EEST|CAT|SAST|FLST|MSK|MSD|EAT|AST_AR|TRT|SYOT|IRST|IRDT|GST|MUT|RET|SCT|SAMT|GET|AZT|AZST|AFT|PKT|UZT|TJT|TMT|MVT|YEKT|YEKST|AQTT|IST|SLT|NPT|BST|BTT|ALMT|OMST|OMSST|VOST|IOT|CCT|MMT|WIB|ICT|THA|KRAT|KRAST|HOVT|SGT|HKT|CST_CN|MYT|AWST|AWDT|BNT|ULAT|PHST|IRKT|IRKST|CWST|JST|KST|TLT|YAKT|YAKST|WIT|ACST|ACDT|AEST|AEDT|ChST|PGT|VLAT|VLAST|SBT|NCT|PONT|KOST|NFT|LHST|LHDT|NZST|NZDT|FJT|FJST|TVT|MHT|GILT|ANAT|ANAST|PETT|PETST|WAKT|NRUT|CHAST|CHADT|PHOT|TOT|WSST|TKT|LINT)\b/i;
  const tzMatch = templateStr.match(timezoneRegex);
  const zoneLabel = tzMatch ? tzMatch[1].toUpperCase() : "UTC"; // fallback to UTC

  // 3. Resolve timezone offset in fractional hours
  let offsetHours = 0;
  if (/^(?:GMT|UTC)[+-]\d/.test(zoneLabel)) {
    offsetHours = parseFloat(zoneLabel.replace(/^(?:GMT|UTC)/, ""));
  } else {
    offsetHours = TIME_ZONE_OFFSETS[zoneLabel] ?? 0;
  }

  // 4. Parse UTC time components from banglaDateStr
  const timePart = timePartRaw?.split(".")[0];
  if (!timePart) throw new Error("Missing time in Bangla date string");

  const [h, m, s] = timePart.split(":").map(Number);
  if ([h, m, s].some(isNaN)) throw new Error("Invalid time format");

  // 5. Apply timezone offset to obtain local time
  const localDate = new Date(
    Date.UTC(2000, 0, 1, h, m, s) + offsetHours * 3_600_000
  );
  const lH = localDate.getUTCHours();
  const lM = localDate.getUTCMinutes();
  const lS = localDate.getUTCSeconds();
  const lH12 = lH % 12 || 12;
  const ampm = lH >= 12 ? "PM" : "AM";

  // 6. Template-aware substitution: when we have the Gregorian reference date
  //    that generated templateStr, replace each numeric field precisely.
  if (gregorianRef) {
    const gY = gregorianRef.getUTCFullYear();
    const gMo = gregorianRef.getUTCMonth() + 1; // 1-indexed
    const gD = gregorianRef.getUTCDate();
    const gH = gregorianRef.getUTCHours();
    const gMi = gregorianRef.getUTCMinutes();
    const gS = gregorianRef.getUTCSeconds();

    /**
     * Replace the *first* occurrence of `from` in `str`.
     * Tries the zero-padded form first (avoids false-positives on single-
     * digit substrings), then the bare form at a numeric word boundary.
     * The replacement preserves the padding style of the matched text.
     */
    const replaceFirst = (str: string, from: number, to: number): string => {
      const bare = String(from);
      const padded = bare.padStart(2, "0");
      const toBare = String(to);
      const toPadded = toBare.padStart(2, "0");
      if (padded !== bare) {
        const idx = str.indexOf(padded);
        if (idx !== -1)
          return str.slice(0, idx) + toPadded + str.slice(idx + padded.length);
      }
      return str.replace(new RegExp(`(?<!\\d)${bare}(?!\\d)`), toBare);
    };

    let result = templateStr;
    // 4-digit year is unambiguous — replace first
    result = result.replace(String(gY), bYear);
    // Month then day (month typically comes before day in numeric formats)
    result = replaceFirst(result, gMo, parseInt(bMonth, 10));
    result = replaceFirst(result, gD, parseInt(bDay, 10));

    // Time components
    const has12h = /\b(AM|PM)\b/i.test(templateStr);
    if (has12h) {
      const gH12 = gH % 12 || 12;
      result = replaceFirst(result, gH12, lH12);
      result = replaceFirst(result, gMi, lM);
      result = replaceFirst(result, gS, lS);
      const origAmpm = gH >= 12 ? "PM" : "AM";
      result = result.replace(new RegExp(`\\b${origAmpm}\\b`, "i"), ampm);
    } else {
      result = replaceFirst(result, gH, lH);
      result = replaceFirst(result, gMi, lM);
      result = replaceFirst(result, gS, lS);
    }
    return result;
  }

  // 7. Fallback (no gregorianRef): heuristic from template-shape detection
  const isTimeOnly = /\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?/i.test(templateStr);
  const isDateOnly =
    /\d{1,2}\/\d{1,2}\/\d{4}/.test(templateStr) ||
    /\d{1,2}-\d{1,2}-\d{4}/.test(templateStr);

  const formattedDate = `${bMonth}/${bDay}/${bYear}`;
  const formattedTime = `${lH12}:${String(lM).padStart(2, "0")}:${String(
    lS
  ).padStart(2, "0")} ${ampm}`;

  if (isDateOnly && isTimeOnly)
    return `${formattedDate}, ${formattedTime} ${zoneLabel}`;
  if (isDateOnly) return formattedDate;
  if (isTimeOnly) return `${formattedTime} ${zoneLabel}`;
  return `${formattedDate} ${formattedTime} ${zoneLabel}`;
}

