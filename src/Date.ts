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

  


}
export default BanglaDate;
