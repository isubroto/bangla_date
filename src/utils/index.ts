type NumberInWords = {
  [key: number]: string;
};

type NumbersInWords = {
  en: NumberInWords;
  bn: NumberInWords;
  hi: NumberInWords;
};

export const numberToWords = (num: number, language: keyof NumbersInWords = "en") => {
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
      30: "ত্রিশ",
      40: "চল্লিশ",
      50: "পঞ্চাশ",
      60: "ষাট",
      70: "সত্তর",
      80: "আশি",
      90: "নব্বই",
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
      30: "तीस",
      40: "चालीस",
      50: "पचास",
      60: "साठ",
      70: "सत्तर",
      80: "अस्सी",
      90: "नब्बे",
      100: "सौ",
      1000: "हज़ार",
    },
  };

  // Helper function to convert number to words for numbers below 100
  const convertBelowHundred = (
    num: number,
    language: keyof typeof numbersInWords
  ) => {
    if (num <= 20) {
      return numbersInWords[language][num];
    }
    const tens = Math.floor(num / 10) * 10;
    const ones = num % 10;
    return ones
      ? `${numbersInWords[language][tens]} ${numbersInWords[language][ones]}`
      : numbersInWords[language][tens];
  };

  // Helper function to convert number to words for numbers below 1000
  const convertBelowThousand = (num:number, language: keyof typeof numbersInWords) => {
    if (num < 100) return convertBelowHundred(num, language);

    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;

    // In Bengali and Hindi, "শত" or "सौ" are used for hundreds
    const hundredWord =
      language === "bn"
        ? `${numbersInWords[language][hundreds]}শ`
        : `${numbersInWords[language][hundreds]}सौ`;

    return remainder
      ? `${hundredWord} ${convertBelowHundred(remainder, language)}`
      : hundredWord;
  };

  if (num === 0) return numbersInWords[language][0];
  if (num < 1000) return convertBelowThousand(num, language);

  // For numbers 1000 and above, handle thousands
  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;
  return remainder
    ? `${convertBelowThousand(thousands, language)} ${
        numbersInWords[language][1000]
      } ${convertBelowThousand(remainder, language)}`
    : `${convertBelowThousand(thousands, language)} ${
        numbersInWords[language][1000]
      }`;
};

export const numberToNumber = (
  num: number|string,
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

 return num.toString().replace(
   /\d/g,
   (digit) => numbersInNumber[language][parseInt(digit)]
 );
};

export function formatBanglaDateToMatchTemplate(
  banglaDateStr: string, // e.g. "1431-12-30 13:39:24.403 UTC"
  templateStr: string // e.g. "04/12/2025, 1:39:24 PM" or "4/12/2025"
): string {
  // 1. Extract Bangla calendar date
  const [banglaDatePart, timePartRaw] = banglaDateStr.split(" "); // "1431-12-30", "13:39:24.403"
  const [year, month, day] = banglaDatePart.split("-");
  if (!year || !month || !day) throw new Error("Invalid Bangla date");

  // 2. Try to extract timezone (optional)
  const timezoneRegex = /(GMT[+-]?\d+|UTC|PST|EST|CET|BST)/i;
  const tzMatch = templateStr.match(timezoneRegex);
  const zoneLabel = tzMatch ? tzMatch[1].toUpperCase() : "UTC"; // fallback to UTC

  const timeZoneOffsets: Record<string, number> = {
    UTC: 0,
    GMT: 0,
    PST: -8,
    EST: -5,
    CET: 1,
    BST: 6,
  };

  let offsetHours = 0;
  if (zoneLabel.startsWith("GMT") && /[+-]\d+/.test(zoneLabel)) {
    offsetHours = parseInt(zoneLabel.replace("GMT", ""));
  } else if (zoneLabel in timeZoneOffsets) {
    offsetHours = timeZoneOffsets[zoneLabel];
  } else {
    offsetHours = 0; // unknown zone, fallback to UTC
  }

  // 3. Extract time from BanglaDate string
  const timePart = timePartRaw?.split(".")[0]; // "13:39:24"
  if (!timePart) throw new Error("Missing time in Bangla date");

  const [h, m, s] = timePart.split(":").map(Number);
  if ([h, m, s].some(isNaN)) throw new Error("Invalid time format");

  const utcDate = new Date(Date.UTC(2000, 0, 1, h, m, s)); // dummy date in UTC
  const localDate = new Date(utcDate.getTime() + offsetHours * 60 * 60 * 1000);

  // 4. Extract template type (date, time, or datetime)
  const isTimeOnly = /(\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?/i.test(templateStr);
  const isDateOnly =
    /\d{1,2}\/\d{1,2}\/\d{4}/.test(templateStr) ||
    /\d{1,2}-\d{1,2}-\d{4}/.test(templateStr);

  // 5. Format time if template requires time
  let formattedTime = "";
  if (isTimeOnly || !isDateOnly) {
    let hour = localDate.getUTCHours();
    const minute = localDate.getUTCMinutes().toString().padStart(2, "0");
    const second = localDate.getUTCSeconds().toString().padStart(2, "0");
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    formattedTime = `${hour}:${minute}:${second} ${ampm}`;
  }

  // 6. Format date if template requires date
  let formattedDate = "";
  if (isDateOnly || !isTimeOnly) {
    formattedDate = `${month}/${day}/${year}`;
  }

  // 7. Combine date and time parts based on the template
  if (isDateOnly && isTimeOnly) {
    return `${formattedDate}, ${formattedTime} ${zoneLabel}`;
  } else if (isDateOnly) {
    return formattedDate;
  } else if (isTimeOnly) {
    return `${formattedTime} ${zoneLabel}`;
  } else {
    return `${formattedDate} ${formattedTime} ${zoneLabel}`;
  }
}
