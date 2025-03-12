'use strict';

/**
 * Custom error for validation failures
 * @extends Error
 */
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {
    ValidationError
};
