/**
 * @description Wraps an async Express handler so any thrown error or rejected promise
 * is passed to next(err), landing in the central error middleware instead of crashing
 * the process or leaving the request hanging.
 *
 * Usage: router.post("/", catchAsync(someAsyncController))
 */
function catchAsync(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

module.exports = catchAsync