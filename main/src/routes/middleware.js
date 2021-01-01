const SpotifyWebApi = require("spotify-web-api-node");
const {RefreshCredentialService} = require("../service/RefreshCredentialService");

/**
 * Checks whether user is authenticated and authorized. If so, proceed with next(), otherwise redirect user to login page
 * Used as middleware
 * @param req - current incoming request
 * @param res - current response to request
 * @param next - handler for next fn
 * @returns {Promise<T | void>|*|void|Response}
 */
function checkCredentials(req, res, next) {
    if (!req.session.access_token) {
        return res.redirect("/spotify/login");
    }

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_API_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: process.env.CALLBACK_URL,
    });
    spotifyApi.setAccessToken(req.session.access_token);
    const refreshCredentialService = new RefreshCredentialService(spotifyApi);

    return refreshCredentialService.checkCredentials()
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
 * Checks validity of request body for POST /webcam
 * Used as middleware
 * @param req - current incoming request
 * @param res - current response to request
 * @param next - handler for next fn
 * @returns {Promise<T | void>|*|void|Response}
 */
function checkWebcamPostBody(req, res, next) {
    if (!req.body || !req.body.dataURL) {
        return res.status(404).json({errorMsg: "Please try taking another photo!"});
    } else {
        return next();
    }
}

/**
 * Checks validity of request body for POST /tracks
 * Used as middleware
 * @param req - current incoming request
 * @param res - current response to request
 * @param next - handler for next fn
 * @returns {Promise<T | void>|*|void|Response}
 */
function checkTrackPostBody(req, res, next) {
    if (!req.body || !req.body.tracks || !Array.isArray(req.body.tracks) || req.body.tracks.length === 0) {
        return res.status(400).json({errorMsg: "Selected playlist tracks are invalid"});
    } else if (!req.body.mood || typeof req.body.mood !== "string") {
        return res.status(400).json({errorMsg: "No mood was specified for the playlist"});
    }else {
        return next();
    }
}

module.exports.checkCredentials = checkCredentials;
module.exports.checkWebcamPostBody = checkWebcamPostBody;
module.exports.checkTrackPostBody = checkTrackPostBody;
