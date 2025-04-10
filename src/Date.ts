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
  static now(language: Language = "en"): BanglaDate {
    return new BanglaDate(new Date(), language);
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

    const monthIndex = banglaMonthNames[monthName];
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
  getDate(): number {
    return this.banglaDay;
  }

  getDay(): number {
    return this.gregorianDate.getDay();
  }

  getFullYear(): number {
    if (this.language === "en") {
      return this.gregorianDate.getFullYear(); // Gregorian year
    } else {
      return this.language === "bn" ? this.banglaYear : this.banglaYear + 593; // Bengali/Sanskrit year
    }
  }

  getHours(): number {
    return this.gregorianDate.getHours();
  }

  getMilliseconds(): number {
    return this.gregorianDate.getMilliseconds();
  }

  getMinutes(): number {
    return this.gregorianDate.getMinutes();
  }

  getMonth(): number {
    return this.banglaMonthIndex;
  }

  getSeconds(): number {
    return this.gregorianDate.getSeconds();
  }

  getTime(): number {
    return this.gregorianDate.getTime();
  }

  getTimezoneOffset(): number {
    return this.gregorianDate.getTimezoneOffset();
  }

  getUTCDate(): number {
    return this.gregorianDate.getUTCDate();
  }

  getUTCDay(): number {
    return this.gregorianDate.getUTCDay();
  }

  getUTCFullYear(): number {
    return this.gregorianDate.getUTCFullYear();
  }

  getUTCHours(): number {
    return this.gregorianDate.getUTCHours();
  }

  getUTCMilliseconds(): number {
    return this.gregorianDate.getUTCMilliseconds();
  }

  getUTCMinutes(): number {
    return this.gregorianDate.getUTCMinutes();
  }

  getUTCMonth(): number {
    return this.gregorianDate.getUTCMonth();
  }

  getUTCSeconds(): number {
    return this.gregorianDate.getUTCSeconds();
  }

  getYear(): number {
    return this.language === "en"
      ? this.gregorianDate.getFullYear() - 1900
      : this.banglaYear;
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



}
export default BanglaDate;
