/**
 * Checks whether user is authenticated and authorized. If so, proceed with next(), otherwise redirect user to login page
 * Used as middle ware function
 * */
function checkCredentials(req, res, next) {
    let main = req.app.locals.main;
    if (!isMainValid) {
        req.app.locals.main = new Main();
        return res.redirect('/spotify/login');
    }

    return main.refreshCredentialService.checkCredentials()
        .then((result) => {
            if (result) return next();
            return res.redirect('/spotify/login');
        })
        .catch((err) => {
            console.log(err);
            throw err;
        })
}

/**
 * Tries refreshing the credentials if they are invalid.
 * Used as middle ware function
 * */
function refreshCredentialsIfExpired(req, res, next) {
    let main = req.app.locals.main;
    if (!isMainValid) {
        req.app.locals.main = new Main();
        return res.redirect('/spotify/login');
    }

    return main.refreshCredentialService.checkCredentials()
        .then((isValid) => {
            if (!isValid) {
                return main.refreshCredentialService.tryRefreshCredential();
            }
        })
        .then(() => {
            next()
        })
        .catch((err) => {
            throw err;
        })
}

/**
 * Checks whether the instance Main is valid
 * */
function isMainValid(main) {
    return main && main.spotifyApi && main.refreshCredentialService && main.spotifyApi.getAccessToken() && main.spotifyApi.getRefreshToken()
}

module.exports.checkCredentials = checkCredentials;
module.exports.refreshCredentialsIfExpired = refreshCredentialsIfExpired;