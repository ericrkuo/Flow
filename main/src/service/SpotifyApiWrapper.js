const WebapiError = require("spotify-web-api-node/src/webapi-error");

const TIME_TO_WAIT = 5000; // 5 seconds\

/**
 * Executes a callback function.
 * * If rate limiting error is thrown, pause execution and try again
 */
function executeMethod(callback) {
    return callback()
        .then((res) => {
            return Promise.resolve(res);
        })
        .catch(async (e) => {
            if (e instanceof WebapiError && e.statusCode === 429) {
                console.log(`Rate limiting error - trying again after ${TIME_TO_WAIT/1000} seconds`);
                await sleep(TIME_TO_WAIT);
                return callback();
            } else {
                throw e;
            }
        });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.executeMethod = executeMethod;