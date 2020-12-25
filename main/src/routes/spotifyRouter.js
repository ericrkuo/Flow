const express = require("express");
const qs = require("querystring");
const router = express.Router();

const scopes = ["user-read-private",
    "user-read-email",
    "playlist-modify-public",
    "playlist-modify-private",
    "user-read-recently-played",
    "user-top-read",
    "user-library-read",
    "user-follow-read",
    "playlist-read-private",
    "user-read-private",
    "playlist-read-collaborative"];

/**
 * Generates a random string containing numbers and letters
 * @param  {number} - length The length of the string
 * @return {string} - the generated string
 */
const generateRandomString = function(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const stateKey = "spotify_auth_state";

/**
 * Handles GET request for spotify page
 */
router.get("/", function (req, res) {
    res.render("index", {title: "Express"});
});

/**
 * Handles GET request for spotify/login page
 */
router.get("/login", (req, res) => {
    const spotifyApi = req.app.locals.main.spotifyApi;
    const html = spotifyApi.createAuthorizeURL(scopes);
    console.log(html);

    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    res.redirect(html + "&state=" + state + "&show_dialog=true");
});

/**
 * Handles GET request for spotify/callback page
 */
router.get("/callback", async (req, res) => {
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect("/#" +
            qs.stringify({
                error: "state_mismatch",
            }));
        return;
    }

    const spotifyApi = req.app.locals.main.spotifyApi;
    const {code} = req.query;
    console.log(code);
    try {
        const data = await spotifyApi.authorizationCodeGrant(code);
        const {access_token, refresh_token} = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        console.log("SPOTIFY - set access and refresh tokens");
        console.log("ACCESS TOKEN: " + req.app.locals.main.spotifyService.spotifyApi.getAccessToken());
        console.log("\n");
        console.log("REFRESH TOKEN: " + req.app.locals.main.spotifyService.spotifyApi.getRefreshToken());
        res.redirect("/webcam");
    } catch (err) {
        res.redirect("/#/error/invalid token");
    }
});

module.exports = router;