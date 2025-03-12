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

- **Epoch**: The calendar epoch is set at 593-594 CE
- **Months**: 12 months of varying lengths
  - Boishakh, Joishtho, Asharh, Shrabon, Bhadro, Ashwin
  - Kartik, Ogrohayon, Poush, Magh, Falgun, Choitro
- **Days**: Named after celestial bodies
  - Robibar (Sun), Sombar (Moon), Mongolbar (Mars)
  - Budhbar (Mercury), Brihoshpotibar (Jupiter)
  - Shukrobar (Venus), Shonibar (Saturn)

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!