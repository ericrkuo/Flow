const rateLimit = require("express-rate-limit");

const webcamLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 30 min window
    max: 10, // start blocking after 5 requests
    message: {errorMsg: "Too many requests, please try again after an hour"},
});

const trackLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min window
    max: 5, // start blocking after 5 requests
    message: {errorMsg: "Too many playlists created, please try again after 10 minutes"},
});

module.exports.webcamLimiter = webcamLimiter;
module.exports.trackLimiter = trackLimiter;
