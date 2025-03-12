# Bangla Date

A JavaScript implementation of the Bangla Calendar based on Surya Siddhanta calculations.

## Features

- Full implementation of Date-like API for Bangla calendar
- High-accuracy calculations based on Surya Siddhanta
- Proper handling of leap years
- Support for both local time and UTC
- Regional month names and day names in Bangla

## Installation

```bash
npm install bangla-date
```

## Usage

```javascript
const BanglaDate = require('bangla-date');

// Create a new Bangla date (current date)
const today = new BanglaDate();
console.log(today.toString());  // "Budhbar 28 Falgun 1430"

// Create from a specific date
const specificDate = new BanglaDate('2024-03-12');
console.log(specificDate.toString());

// Get date components
console.log(specificDate.getDate());      // Day of month
console.log(specificDate.getMonth());     // Month (0-11)
console.log(specificDate.getFullYear());  // Bangla year

// Historical date example (Bangladesh Independence Day)
const independenceDay = new BanglaDate('1971-03-26');
console.log(independenceDay.toString());  // "Shukrobar 12 Choitro 1377"
```

## API Reference

### Constructor

#### `new BanglaDate([...args])`
Creates a new BanglaDate object. Accepts the same arguments as the JavaScript Date constructor.

### Static Methods

- `BanglaDate.now()`: Returns the current timestamp
- `BanglaDate.parse(dateString)`: Parses a date string
- `BanglaDate.UTC(...)`: Creates a date from UTC components

### Instance Methods

#### Getters
- `getDate()`: Returns the day of the month (1-31)
- `getDay()`: Returns the day of the week (0-6)
- `getFullYear()`: Returns the Bangla year
- `getMonth()`: Returns the Bangla month (0-11)
- `getHours()`, `getMinutes()`, `getSeconds()`, `getMilliseconds()`
- UTC variants: `getUTCDate()`, `getUTCDay()`, etc.

#### Setters
- `setDate(date)`: Sets the day of the month
- `setFullYear(year)`: Sets the Bangla year
- `setMonth(month)`: Sets the Bangla month
- `setHours(hours)`, `setMinutes(minutes)`, etc.
- UTC variants: `setUTCDate(date)`, `setUTCMonth(month)`, etc.

#### Conversion Methods
- `toString()`: Returns "Day Date Month Year"
- `toDateString()`: Returns the date portion
- `toTimeString()`: Returns the time portion
- `toLocaleString()`, `toLocaleDateString()`, `toLocaleTimeString()`
- `toUTCString()`, `toISOString()`, `toJSON()`

## Calendar Details

The Bangla calendar is based on the Surya Siddhanta, an ancient Sanskrit astronomical treatise. Key aspects:

### Epoch and Calculations
- **Epoch**: The calendar epoch is set at 593-594 CE (14th April 593 CE)
- **Solar Year**: Based on the apparent motion of the sun
- **Sidereal Calculations**: Uses true solar days rather than mean solar days
- **Leap Year**: Handled automatically based on astronomical calculations
- **Surya Siddhanta Details**: The Surya Siddhanta employs complex astronomical calculations to determine the exact position of the sun and moon, factoring in their elliptical orbits and other celestial influences. This allows for high precision in determining the Bangla dates.


### Month Structure
Each month is carefully calculated based on the sun's transit through various constellations:
- First 5 months (Boishakh to Bhadro): 31 days each
- Last 7 months (Ashwin to Choitro): 30 days each
- Leap year adjustments are made in Falgun

### Months
1. Boishakh (বৈশাখ) - 31 days
2. Joishtho (জ্যৈষ্ঠ) - 31 days
3. Asharh (আষাঢ়) - 31 days
4. Shrabon (শ্রাবণ) - 31 days
5. Bhadro (ভাদ্র) - 31 days
6. Ashwin (আশ্বিন) - 30 days
7. Kartik (কার্তিক) - 30 days
8. Ogrohayon (অগ্রহায়ণ) - 30 days
9. Poush (পৌষ) - 30 days
10. Magh (মাঘ) - 30 days
11. Falgun (ফাল্গুন) - 30 days (31 in leap years)
12. Choitro (চৈত্র) - 30 days

### Days of Week
Named after celestial bodies:
- Robibar (রবিবার) - Sunday (Sun)
- Sombar (সোমবার) - Monday (Moon)
- Mongolbar (মঙ্গলবার) - Tuesday (Mars)
- Budhbar (বুধবার) - Wednesday (Mercury)
- Brihoshpotibar (বৃহস্পতিবার) - Thursday (Jupiter)
- Shukrobar (শুক্রবার) - Friday (Venus)
- Shonibar (শনিবার) - Saturday (Saturn)

## Regional Variations

The package supports different regional variations of month names:

### Bangladesh Standard
```javascript
const date = new BanglaDate('2024-04-14');
console.log(date.toString());  // Uses standard Bengali names
```

### West Bengal Variation
```javascript
const date = new BanglaDate('2024-04-14');
console.log(date.toString('west-bengal'));  // Uses West Bengal naming
```

### Chittagong Variation
```javascript
const date = new BanglaDate('2024-04-14');
console.log(date.toString('chittagong'));  // Uses Chittagong dialect
```

## Historical Date Examples

```javascript
// Bangladesh Independence Day
const independenceDay = new BanglaDate('1971-03-26');
// Returns: "Shukrobar 12 Choitro 1377"

// Bengali New Year (Pohela Boishakh) 2024
const newYear = new BanglaDate('2024-04-14');
// Returns: "Robibar 1 Boishakh 1431"

// Victory Day
const victoryDay = new BanglaDate('1971-12-16');
// Returns: "Brihoshpotibar 1 Poush 1378"

// Language Movement Day
const languageDay = new BanglaDate('1952-02-21');
// Returns: "Brihoshpotibar 8 Falgun 1358"

// First Partition of Bengal
const bengalPartition = new BanglaDate('1905-10-16');
// Returns: "Sombar 29 Ashwin 1312"

// Rabindranath Tagore's Birthday
const tagoresBirthday = new BanglaDate('1861-05-07');
// Returns: "Mongolbar 25 Boishakh 1268"
```

## Contributing

Feel free to submit issues and enhancement requests!

## License 

ISC