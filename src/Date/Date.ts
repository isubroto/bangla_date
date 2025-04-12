import { formatBanglaDateToMatchTemplate, numberToNumber } from "../utils/utils.js";

type Language = "en" | "bn" | "hi";

class BanglaDate {
  private banglaYear: number;
  private banglaMonthIndex: number;
  private banglaDay: number;
  private gregorianDate: Date;
  private language: Language;
  private date: string;

  constructor(gregorianDate: Date, language: Language = "en") {
    this.language = language;
    this.gregorianDate = new Date(gregorianDate.getTime());
    const gYear = this.gregorianDate.getUTCFullYear();
    const pohelaBoishakh = new Date(Date.UTC(gYear, 3, 14));
    const isBeforePohelaBoishakh =
      this.gregorianDate.getTime() < pohelaBoishakh.getTime();
    this.banglaYear = (isBeforePohelaBoishakh ? gYear - 1 : gYear) - 593;

    const refYear = isBeforePohelaBoishakh ? gYear - 1 : gYear;
    const refDate = new Date(Date.UTC(refYear, 3, 14));
    const dayDiff = Math.floor(
      (this.gregorianDate.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const monthLengths = [
      31,
      31,
      31,
      31,
      31,
      30,
      30,
      30,
      30,
      30,
      BanglaDate.isLeapYear(refYear + 1) ? 30 : 29, // Falgun leap handling
      30,
    ];

    let remainingDays = dayDiff;
    let monthIndex = 0;
    while (monthIndex < 12 && remainingDays >= monthLengths[monthIndex]) {
      remainingDays -= monthLengths[monthIndex];
      monthIndex++;
    }

    this.banglaMonthIndex = monthIndex;
    this.banglaDay = remainingDays + 1;
    this.date = numberToNumber(
      `${this.banglaYear}-${this.banglaMonthIndex + 1}-${
        this.banglaDay
      } ${this.gregorianDate.getHours()}:${this.gregorianDate.getMinutes()}:${this.gregorianDate.getSeconds()}.${this.gregorianDate.getMilliseconds()} ${
        this.language === "bn"
          ? "সার্বজনীন সময়"
          : this.language === "hi"
          ? "सार्वभौमिक समय"
          : "UTC"
      }`,
      this.language
    );
  }

  // **Static Methods**:
  now(): string {
    return this.date;
  }
  parse(dateString: string): string {
    const [day, monthName, yearWithBS] = dateString.split(" ");

    const banglaMonthNames = {
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

    const monthIndex =
      banglaMonthNames[monthName as keyof typeof banglaMonthNames];
    const dayOfMonth = parseInt(day);
    const yearInBS = parseInt(yearWithBS);

    const gregorianYear = yearInBS + 593;
    const pohelaBoishakh = new Date(Date.UTC(gregorianYear, 3, 14));

    const monthLengths = [
      31,
      31,
      31,
      31,
      31,
      30,
      30,
      30,
      30,
      30,
      BanglaDate.isLeapYear(gregorianYear + 1) ? 30 : 29,
      30,
    ];

    let dayOffset = 0;
    for (let i = 0; i < monthIndex; i++) {
      dayOffset += monthLengths[i];
    }

    dayOffset += dayOfMonth - 1;
    const gDate = new Date(
      pohelaBoishakh.getTime() + dayOffset * (1000 * 60 * 60 * 24)
    );

    const banglaDate = new BanglaDate(gDate, this.language);
    return banglaDate.date;
  }

  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  // **Accessor Methods**:
  getDate(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.banglaDay, "bn"); // Gregorian date
      case "hi":
        return numberToNumber(this.banglaDay, "hi"); // Bengali date
      default:
        return this.banglaDay.toString(); // Default to Bengali date for unsupported languages
    }
  }

  getDay(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getDay(), "bn"); // Bengali day
      case "hi":
        return numberToNumber(this.gregorianDate.getDay(), "hi"); // Sanskrit day
      default:
        return this.gregorianDate.getDay().toString(); // Default to Gregorian day for unsupported languages
    }
  }

  getFullYear(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.banglaYear, "bn"); // Bengali year
      case "hi":
        return numberToNumber(this.banglaYear, "hi"); // Sanskrit year
      default:
        return this.banglaYear.toString(); // Default to Bengali year for unsupported languages
    }
  }

  getHours(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getHours(), "bn"); // Bengali hours
      case "hi":
        return numberToNumber(this.gregorianDate.getHours(), "hi"); // Sanskrit hours
      default:
        return this.gregorianDate.getHours().toString(); // Default to Gregorian hours for unsupported languages
    }
  }

  getMilliseconds(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getMilliseconds(), "bn"); // Bengali milliseconds
      case "hi":
        return numberToNumber(this.gregorianDate.getMilliseconds(), "hi"); // Sanskrit milliseconds
      default:
        return this.gregorianDate.getMilliseconds().toString(); // Default to Gregorian milliseconds for unsupported languages
    }
  }

  getMinutes(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getMinutes(), "bn"); // Bengali minutes
      case "hi":
        return numberToNumber(this.gregorianDate.getMinutes(), "hi"); // Sanskrit minutes
      default:
        return this.gregorianDate.getMinutes().toString(); // Default to Gregorian minutes for unsupported languages
    }
  }

  getMonth(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.banglaMonthIndex + 1, "bn"); // Bengali month
      case "hi":
        return numberToNumber(this.banglaMonthIndex + 1, "hi"); // Sanskrit month
      default:
        return (this.banglaMonthIndex + 1).toString(); // Default to Bengali month for unsupported languages
    }
  }

  getSeconds(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getSeconds(), "bn"); // Bengali seconds
      case "hi":
        return numberToNumber(this.gregorianDate.getSeconds(), "hi"); // Sanskrit seconds
      default:
        return this.gregorianDate.getSeconds().toString(); // Default to Gregorian seconds for unsupported languages
    }
  }

  getTime(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getTime(), "bn"); // Bengali time
      case "hi":
        return numberToNumber(this.gregorianDate.getTime(), "hi"); // Sanskrit time
      default:
        return this.gregorianDate.getTime().toString(); // Default to Gregorian time for unsupported languages
    }
  }

  getTimezoneOffset(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getTimezoneOffset(), "bn"); // Bengali timezone offset
      case "hi":
        return numberToNumber(this.gregorianDate.getTimezoneOffset(), "hi"); // Sanskrit timezone offset
      default:
        return this.gregorianDate.getTimezoneOffset().toString(); // Default to Gregorian timezone offset for unsupported languages
    }
  }

  getUTCDate(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getUTCDate(), "bn"); // Bengali UTC date
      case "hi":
        return numberToNumber(this.gregorianDate.getUTCDate(), "hi"); // Sanskrit UTC date
      default:
        return this.gregorianDate.getUTCDate().toString(); // Default to Gregorian UTC date for unsupported languages
    }
  }

  getUTCDay(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getUTCDay(), "bn"); // Bengali UTC day
      case "hi":
        return numberToNumber(this.gregorianDate.getUTCDay(), "hi"); // Sanskrit UTC day
      default:
        return this.gregorianDate.getUTCDay().toString(); // Default to Gregorian UTC day for unsupported languages
    }
  }

  getUTCFullYear(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getUTCFullYear(), "bn"); // Bengali UTC full year
      case "hi":
        return numberToNumber(this.gregorianDate.getUTCFullYear(), "hi"); // Sanskrit UTC full year
      default:
        return this.gregorianDate.getUTCFullYear().toString(); // Default to Gregorian UTC full year for unsupported languages
    }
  }

  getUTCHours(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getUTCHours(), "bn"); // Bengali UTC hours
      case "hi":
        return numberToNumber(this.gregorianDate.getUTCHours(), "hi"); // Sanskrit UTC hours
      default:
        return this.gregorianDate.getUTCHours().toString(); // Default to Gregorian UTC hours for unsupported languages
    }
  }

  getUTCMilliseconds(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getUTCMilliseconds(), "bn"); // Bengali UTC milliseconds
      case "hi":
        return numberToNumber(this.gregorianDate.getUTCMilliseconds(), "hi"); // Sanskrit UTC milliseconds
      default:
        return this.gregorianDate.getUTCMilliseconds().toString(); // Default to Gregorian UTC milliseconds for unsupported languages
    }
  }

  getUTCMinutes(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getUTCMinutes(), "bn"); // Bengali UTC minutes
      case "hi":
        return numberToNumber(this.gregorianDate.getUTCMinutes(), "hi"); // Sanskrit UTC minutes
      default:
        return this.gregorianDate.getUTCMinutes().toString(); // Default to Gregorian UTC minutes for unsupported languages
    }
  }

  getUTCMonth(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getUTCMonth(), "bn"); // Bengali UTC month
      case "hi":
        return numberToNumber(this.gregorianDate.getUTCMonth(), "hi"); // Sanskrit UTC month
      default:
        return this.gregorianDate.getUTCMonth().toString(); // Default to Gregorian UTC month for unsupported languages
    }
  }

  getUTCSeconds(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.gregorianDate.getUTCSeconds(), "bn"); // Bengali UTC seconds
      case "hi":
        return numberToNumber(this.gregorianDate.getUTCSeconds(), "hi"); // Sanskrit UTC seconds
      default:
        return this.gregorianDate.getUTCSeconds().toString(); // Default to Gregorian UTC seconds for unsupported languages
    }
  }

  getYear(): string {
    switch (this.language) {
      case "bn":
        return numberToNumber(this.banglaYear, "bn"); // Bengali year
      case "hi":
        return numberToNumber(this.banglaYear, "hi"); // Sanskrit year
      default:
        return (this.gregorianDate.getFullYear() - 1900).toString();
    }
  }
  // **Formatted Output**:
  private getMonthName(): string {
    const monthNames = {
      en: [
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
      bn: [
        "বৈশাখ",
        "জ্যৈষ্ঠ",
        "আষাঢ়",
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
      hi: [
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
    };
    return monthNames[this.language][this.banglaMonthIndex];
  }

  private getWeekDay(): string {
    const weekDays = {
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
    };
    const gDay = this.gregorianDate.getDay();
    return weekDays[this.language][gDay];
  }

  // **toLocaleString() with language formatting**:
  toLocaleDateString(
    locales?: Intl.LocalesArgument,
    options?: Intl.DateTimeFormatOptions
  ): string {
    // If no locales are provided, fall back to the object's language
    const currentLocale = locales ?? this.language;

    // Supported locales prefixes: "en", "bn", "hi", and their variants (like "en-US", "bn-BD", "hi-IN")
    const validLocales = ["en", "bn", "hi"];

    // Check if the provided locale is a string (or array of strings)
    const isValidLocale = Array.isArray(currentLocale)
      ? currentLocale.some((locale) =>
          validLocales.some((valid) => locale.startsWith(valid))
        )
      : validLocales.some((valid) =>
          (currentLocale as string).startsWith(valid)
        );

    if (!isValidLocale) {
      throw new Error(
        `Locale ${currentLocale} is not supported. Supported locales are: ${validLocales.join(
          ", "
        )}, or any variant of them (e.g., en-US, bn-BD, hi-IN).`
      );
    }

    // Define digit maps for supported locales
    const digitsMap: Record<string, string[]> = {
      en: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      bn: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
      hi: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    };
    const ampmMap: Record<string, string[]> = {
      en: ["AM", "PM", "GMT", "UTC", "PST", "EST", "CET", "BST"],
      bn: [
        "পূর্বাহ্ণ",
        "অপরাহ্ণ",
        "জিএমটি",
        "ইউটিসি",
        "পিএসটি",
        "ইএসটি",
        "সিইটি",
        "বিএসটি",
        "জিএমটি",
      ],
      hi: [
        "पूर्वाह्न",
        "अपराह्न",
        "जीएमटी",
        "यूटीसी",
        "पीएसटी",
        "ईएसटी",
        "सीईटी",
        "बीएसटी",
        "जीएमटी",
      ],
    };

    // Helper function to localize digits based on the selected locale
    // Helper function to localize digits based on the selected locale
    const localeKey = currentLocale
      .toString()
      .split("-")[0] as keyof typeof digitsMap;
    const localizeNumber = (num: number | string): string => {
      return num
        .toString()
        .split("")
        .map((d: string) => {
          const digitIndex = parseInt(d, 10);
          return isNaN(digitIndex) ? d : digitsMap[localeKey][digitIndex] ?? d;
        })
        .join("");
    };

    // Format the date using the provided options
    const nDate = new BanglaDate(new Date(this.gregorianDate)).date;
    let formattedDate = formatBanglaDateToMatchTemplate(
      nDate,
      new Intl.DateTimeFormat(
        currentLocale.toString().includes("en") ? currentLocale : "en-US",
        options
      ).format(this.gregorianDate)
    );
    // Localize the formatted date by replacing digits with the appropriate locale digits

    formattedDate = formattedDate
      .split("")
      .map((char) => (/\d/.test(char) ? localizeNumber(char) : char))
      .join("");

    formattedDate = formattedDate
      .split(" ")
      .map((word) => {
        // Normalize input by stripping periods and making uppercase
        const normalized = word.replace(/\./g, "").toUpperCase();
        const index =
          ampmMap["en"].indexOf(normalized) > 0
            ? ampmMap["en"].indexOf(normalized)
            : ampmMap["en"].indexOf(normalized.replace(/[^A-Za-z]/g, ""));

        if (index !== -1) {
          return (
            ampmMap[localeKey][index] +
            (localeKey !== "en" ? word.replace(/[A-Za-z]/g, "") : "")
          );
        }

        return word; // Return unchanged if no match
      })
      .join(" ");

    //return new BanglaDate(new Date(formattedDate.split(", ")[0])).date;
    console.log(formattedDate);
    return formattedDate;
  }

  // Helper function to format numbers
  formatNumber(num: number | string): string {
    return num.toString().padStart(2, "0");
  }
  getAMPM(hour: number | string): string {
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
  // Main format function
  format(formatString: string): string {
    const year = this.banglaYear;
    const month = this.banglaMonthIndex + 1; // Month index starts from 0
    const day = this.banglaDay;
    const hours = this.getHours();
    const minutes = this.getMinutes();
    const seconds = this.getSeconds();

    const replacements: Record<string, string> = {
      WWWW: this.getWeekDayFormat("long"),
      WWW: this.getWeekDayFormat("short"),
      WW: `0${this.gregorianDate.getDay().toString()}`,
      W: this.gregorianDate.getDay().toString(),
      era: this.language === "bn" ? "খ্রিস্টাব্দ" : "AD",
      YYYY: this.formatNumber(year),
      YY: this.formatNumber(year % 100),
      MMMM: this.getFormatedMonthName("long"),
      MMM: this.getFormatedMonthName("short"),
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

    return numberToNumber(
      formatString.replace(
        /WWWW|WWW|WW|W|YYYY|YY|MMMM|MMM|MM|M|DD|D|HH|H|mm|m|ss|s|AM\/PM|era/g,
        (match) => replacements[match] || match
      ),
      this.language
    );
  }

  // Function to get month name in Bangla
  private getFormatedMonthName(format: "long" | "short" = "long"): string {
    const monthNames: Record<string, string[]> = {
      long: [
        "বৈশাখ",
        "জ্যৈষ্ঠ",
        "আষাঢ়",
        "শ্রাবণ",
        "ভাদ্রপদ",
        "আশ্বিন",
        "কার্তিক",
        "অগ্রাহায়ণ",
        "পৌষ",
        "মাঘ",
        "ফাল্গুন",
        "চৈত্র",
      ],
      short: [
        "বৈশা",
        "জ্যৈ",
        "আষা",
        "শ্রা",
        "ভাদ",
        "আশ্বি",
        "কার",
        "অগ্র",
        "পৌ",
        "মা",
        "ফাল",
        "চৈ",
      ],
    };
    return monthNames[format][this.banglaMonthIndex];
  }

  toLocaleString(
    locales?: Intl.LocalesArgument,
    options?: Intl.DateTimeFormatOptions
  ): string {
    // If no locales are provided, fall back to the object's language
    const currentLocale = locales ?? this.language;

    // Supported locales prefixes: "en", "bn", "hi", and their variants (like "en-US", "bn-BD", "hi-IN")
    const validLocales = ["en", "bn", "hi"];

    // Check if the provided locale is a string (or array of strings)
    const isValidLocale = Array.isArray(currentLocale)
      ? currentLocale.some((locale) =>
          validLocales.some((valid) => locale.startsWith(valid))
        )
      : validLocales.some((valid) =>
          (currentLocale as string).startsWith(valid)
        );

    if (!isValidLocale) {
      throw new Error(
        `Locale ${currentLocale} is not supported. Supported locales are: ${validLocales.join(
          ", "
        )}, or any variant of them (e.g., en-US, bn-BD, hi-IN).`
      );
    }

    // Define digit maps for supported locales
    const digitsMap: Record<string, string[]> = {
      en: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
      bn: ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"],
      hi: ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
    };
    const ampmMap: Record<string, string[]> = {
      en: ["AM", "PM", "GMT", "UTC", "PST", "EST", "CET", "BST"],
      bn: [
        "পূর্বাহ্ণ",
        "অপরাহ্ণ",
        "জিএমটি",
        "ইউটিসি",
        "পিএসটি",
        "ইএসটি",
        "সিইটি",
        "বিএসটি",
        "জিএমটি",
      ],
      hi: [
        "पूर्वाह्न",
        "अपराह्न",
        "जीएमटी",
        "यूटीसी",
        "पीएसटी",
        "ईएसटी",
        "सीईटी",
        "बीएसटी",
        "जीएमटी",
      ],
    };

    // Helper function to localize digits based on the selected locale
    // Helper function to localize digits based on the selected locale
    const localeKey = currentLocale
      .toString()
      .split("-")[0] as keyof typeof digitsMap;
    const localizeNumber = (num: number | string): string => {
      return num
        .toString()
        .split("")
        .map((d: string) => {
          const digitIndex = parseInt(d, 10);
          return isNaN(digitIndex) ? d : digitsMap[localeKey][digitIndex] ?? d;
        })
        .join("");
    };

    // Format the date using the provided options
    const nDate = new BanglaDate(new Date(this.gregorianDate)).date;
    let formattedDate = formatBanglaDateToMatchTemplate(
      nDate,
      new Intl.DateTimeFormat(
        currentLocale.toString().includes("en") ? currentLocale : "en-US",
        options
      ).format(this.gregorianDate)
    );
    // Localize the formatted date by replacing digits with the appropriate locale digits

    formattedDate = formattedDate
      .split("")
      .map((char) => (/\d/.test(char) ? localizeNumber(char) : char))
      .join("");

    formattedDate = formattedDate
      .split(" ")
      .map((word) => {
        // Normalize input by stripping periods and making uppercase
        const normalized = word.replace(/\./g, "").toUpperCase();
        const index =
          ampmMap["en"].indexOf(normalized) > 0
            ? ampmMap["en"].indexOf(normalized)
            : ampmMap["en"].indexOf(normalized.replace(/[^A-Za-z]/g, ""));

        if (index !== -1) {
          return (
            ampmMap[localeKey][index] +
            (localeKey !== "en" ? word.replace(/[A-Za-z]/g, "") : "")
          );
        }

        return word; // Return unchanged if no match
      })
      .join(" ");

    //return new BanglaDate(new Date(formattedDate.split(", ")[0])).date;
    console.log(formattedDate);
    return formattedDate;
  }

  private getWeekDayFormat(format: "long" | "short" = "long"): string {
    const weekDays = {
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
    };
    const gDay = this.gregorianDate.getDay();
    return weekDays[format][this.language][gDay];
  }
}

export default BanglaDate;
