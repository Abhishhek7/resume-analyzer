const ApiError = require("../utils/ApiError")

/**
 * @description 404 handler for routes that don't match anything. Must be registered
 * AFTER all real routes and BEFORE the error handler.
 */
function notFound(req, res, next) {
    next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

/**
 * @description Central error-handling middleware. Must be registered LAST, after every
 * other app.use()/route. Express recognizes it as an error handler because it takes 4 args.
 *
 * - Known/expected errors (ApiError) -> respond with their own status code + message.
 * - Mongoose CastError (e.g. malformed ObjectId in a route param) -> 400, not a raw 500.
 * - Mongoose duplicate-key error (e.g. unique username/email) -> 409, with a friendly message.
 * - Anything else -> 500, generic message to the client, full detail logged server-side only.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
    console.error(err)

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
            ...(err.details ? { details: err.details } : {})
        })
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "Invalid identifier provided."
        })
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || "field"
        return res.status(409).json({
            message: `${field} is already in use.`
        })
    }

    return res.status(500).json({
        message: "Something went wrong. Please try again later."
    })
}

module.exports = { notFound, errorHandler }