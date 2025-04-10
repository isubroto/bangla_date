export const numberToWords = (num, language = "en") => {
  const numbersInWords = {
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
  const convertBelowHundred = (num, language) => {
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
  const convertBelowThousand = (num, language) => {
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

export const numberToNumber = (num, language = "en") => {
  const numbersInNumber = {
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

  const numString = num.toString();
  let convertedNumber = "";
  for (let i = 0; i < numString.length; i++) {
    const digit = parseInt(numString[i], 10);
    convertedNumber += numbersInNumber[language][digit];
  }
  return convertedNumber;
};
