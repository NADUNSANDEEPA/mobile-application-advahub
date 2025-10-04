/**
 * Standard API response
 * @param {import('express').Response} res - Express Response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Whether the request was successful
 * @param {string} message - Human-readable message
 * @param {any} [data] - Optional data payload
 * @param {any} [error] - Optional error details
 */
const sendResponse = (res, statusCode, success, message, data, error) => {
    res.status(statusCode).json({ success, message, data, error });
};

module.exports = sendResponse;
