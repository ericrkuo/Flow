

const {Main} = require("../Main");

/**
 * Checks whether user is authenticated and authorized. If so, proceed with next(), otherwise redirect user to login page
 * Used as middle ware function
 * @param req - current incoming request
 * @param res - current response to request
 * @param next - handler for next fn
 * @returns {Promise<T | void>|*|void|Response}
 */
function checkCredentials(req, res, next) {
    const main = req.app.locals.main;
    if (!isMainAndSpotifyApiAndRefreshCredentialValid) {
        req.app.locals.main = new Main();
        return res.redirect("/spotify/login");
    }

    return main.refreshCredentialService.checkCredentials()
        .then((result) => {
            if (result) return next();
            return res.redirect("/spotify/login");
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
}

/**
 * Tries refreshing the credentials if they are invalid.
 * Used as middle ware function
 * @param req - current incoming request
 * @param res - current response to request
 * @param next - handler for next fn
 * @returns {Promise<T | void>|*|void|Response}
 */
function refreshCredentialsIfExpired(req, res, next) {
    const main = req.app.locals.main;
    if (!isMainAndSpotifyApiAndRefreshCredentialValid) {
        req.app.locals.main = new Main();
        return res.redirect("/spotify/login");
    }

    return main.refreshCredentialService.checkCredentials()
        .then((isValid) => {
            if (!isValid) {
                return main.refreshCredentialService.tryRefreshCredential();
            }
        })
        .then(() => {
            return next();
        })
        .catch((err) => {
            throw err;
        });
}

/**
 * Checks whether the instance Main, spotifyApi, and refreshCredentialService are valid
 * @param main - current instance of Main file
 * @returns boolean - returns true if main, spotify api, refresh credential service, and spotify tokens are defined
 */
function isMainAndSpotifyApiAndRefreshCredentialValid(main) {
    return main && main.spotifyApi && main.refreshCredentialService && main.spotifyApi.getAccessToken() && main.spotifyApi.getRefreshToken();
}

module.exports.checkCredentials = checkCredentials;
module.exports.refreshCredentialsIfExpired = refreshCredentialsIfExpired;