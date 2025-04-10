import { numberToNumber } from "../utils/utils.js";

type Language = "en" | "bn" | "hi";

class BanglaDate {
  private banglaYear: number;
  private banglaMonthIndex: number;
  private banglaDay: number;
  private gregorianDate: Date;
  private language: Language;

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
  }

  // **Static Methods**:
  now(): BanglaDate {
    return new BanglaDate(new Date(), this.language);
  }

  static parse(dateString: string, language: Language = "en"): BanglaDate {
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

    const monthIndex = banglaMonthNames[monthName as keyof typeof banglaMonthNames];
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

    return new BanglaDate(gDate, language);
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

  getUTCMonth(): number {
    return this.gregorianDate.getUTCMonth();
  }

  getUTCSeconds(): number {
    return this.gregorianDate.getUTCSeconds();
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
  toLocaleString(
    locales: string,
    options: Intl.DateTimeFormatOptions = {}
  ): string {
    const weekday = options.weekday ?? "long";
    const year = options.year ?? "numeric";
    const month = options.month ?? "long";
    const day = options.day ?? "numeric";

    const formattedDateParts: string[] = [];

    if (weekday) {
      formattedDateParts.push(this.getWeekDay());
    }

    if (day) {
      formattedDateParts.push(`${this.getDate()}`);
    }

    if (month) {
      formattedDateParts.push(this.getMonthName());
    }

    if (year) {
      formattedDateParts.push(`${this.getFullYear()}`);
    }

    return formattedDateParts.join(" ");
  }
}
export default BanglaDate;
