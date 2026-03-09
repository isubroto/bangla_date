# [1.9.0](https://github.com/isubroto/bangla_date/compare/v1.8.0...v1.9.0) (2026-03-09)


### Features

* **date:** normalise input date to UTC midnight and add DateKit- Replace local Date cloning with UTC-normalised date creation in Date constructor so that input dates like "Feb24,2026" or timestamps with timezones consistently map to the same calendar day (YYYY-MM-DDT00:00:00Z) ([c306df8](https://github.com/isubroto/bangla_date/commit/c306df82eab359d30143c09aae594bba3bec87f2))

# [1.8.0](https://github.com/isubroto/bangla_date/compare/v1.7.1...v1.8.0) (2026-03-08)


### Features

* **calendar+tz:** correct month rules and support timezonesUpdate Bangla calendar month definitions and leap-year handling to matchthe Bangladesh National Calendar. Months1–5 are Boishakh–Bhadra (31d), ([66d56cf](https://github.com/isubroto/bangla_date/commit/66d56cf477f77d93f4066f0060ce755f4deef7d5))

## [1.7.1](https://github.com/isubroto/bangla_date/compare/v1.7.0...v1.7.1) (2026-03-08)


### Bug Fixes

* expand _applyLocale JSDoc with params and behaviorClarify that _applyLocale handles toLocaleDateString, toLocaleString, ([f6c6f2f](https://github.com/isubroto/bangla_date/commit/f6c6f2f8a5de5b94274eca24ea570925f519077e))

# [1.7.0](https://github.com/isubroto/bangla_balender/compare/v1.6.1...v1.7.0) (2025-08-18)


### Features

* **obfuscation:** make obfuscation safer and add post-fix step ([2d4b614](https://github.com/isubroto/bangla_balender/commit/2d4b614683220cb2b4c872dba8a6f75d778cc22b))

## [1.6.1](https://github.com/isubroto/bangla_balender/compare/v1.6.0...v1.6.1) (2025-08-18)


### Bug Fixes

* **date:** shorten Bengali month names for consistency ([75fb171](https://github.com/isubroto/bangla_balender/commit/75fb171563b84ca15cf271145525f3471636bf8c))

# [1.6.0](https://github.com/isubroto/bangla_balender/compare/v1.5.0...v1.6.0) (2025-05-10)


### Features

* migrate obfuscation script to TypeScript and update start script to use ts-node ([06a03cf](https://github.com/isubroto/bangla_balender/commit/06a03cfaf26b9df29909467b121f6e4bdc78d78e))

# [1.5.0](https://github.com/isubroto/bangla_balender/compare/v1.4.0...v1.5.0) (2025-04-12)


### Features

* **docs:** update README for BanglaDate usage examples ([62d68fb](https://github.com/isubroto/bangla_balender/commit/62d68fbf28158b36a69c6bb3e6e8f5755f14a6c5))

# [1.4.0](https://github.com/isubroto/bangla_balender/compare/v1.3.0...v1.4.0) (2025-04-12)


### Features

* enhance BanglaDate with localization and formatting ([7861db2](https://github.com/isubroto/bangla_balender/commit/7861db2e79f501a87a2ddfaac6e0ee753cf8b26f))
* enhance date formatting and localization support ([e6f7270](https://github.com/isubroto/bangla_balender/commit/e6f7270edaef07c0d7a0f73375757af203bedce9))

# [1.3.0](https://github.com/isubroto/bangla_balender/compare/v1.2.0...v1.3.0) (2025-04-10)


### Features

* add BanglaDate class and update release workflow ([6efcb1c](https://github.com/isubroto/bangla_balender/commit/6efcb1c308e1ee4ffb0ab86a83608ef9bf78e357))
