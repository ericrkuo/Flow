const {Main} = require("../Main");

/**
 * Checks whether user is authenticated and authorized. If so, proceed with next(), otherwise redirect user to login page
 * Used as middle ware function
 * */
const {Main} = require("../Main");

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
 * */
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
 * */
function isMainAndSpotifyApiAndRefreshCredentialValid(main) {
    return main && main.spotifyApi && main.refreshCredentialService && main.spotifyApi.getAccessToken() && main.spotifyApi.getRefreshToken();
}

/**
 * Checks if webcam post body and dataURL is null or undefined
 */
function checkWebcamPostBody(req, res, next) {
    if (!req.body || !req.body.dataURL) {
        return res.status(404).json({errorMsg: "Please try taking another photo!"});
    } else {
        return next();
    }
}

module.exports.checkCredentials = checkCredentials;
module.exports.refreshCredentialsIfExpired = refreshCredentialsIfExpired;
module.exports.checkWebcamPostBody = checkWebcamPostBody;