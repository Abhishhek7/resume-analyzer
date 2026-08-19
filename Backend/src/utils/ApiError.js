/**
 * @class ApiError
 * @description Custom error class for expected/operational errors (bad input, not found,
 * unauthorized, etc). Throwing this anywhere inside a catchAsync-wrapped controller will
 * be caught and turned into a clean JSON response by the central error middleware, with
 * the status code and message you specify here.
 *
 * Anything that is NOT an ApiError (a genuine bug, a driver-level exception, etc) is treated
 * as an unexpected 500 by the error middleware, and its details are logged but not leaked
 * to the client.
 */
class ApiError extends Error {
    constructor(statusCode, message, details = null) {
        super(message)
        this.statusCode = statusCode
        this.details = details
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ApiError