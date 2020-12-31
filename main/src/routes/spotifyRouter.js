require("dotenv").config();
const express = require("express");
const router = express.Router();
const SpotifyWebApi = require("spotify-web-api-node");
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

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URL,
});

/**
* Generates a random string containing numbers and letters
* @param  {number} length The length of the string
* @return {string} the generated string
*/
function generateRandomString(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

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
    const state = generateRandomString(100);
    req.session.spotifyCallBackState = state;
    const html = spotifyApi.createAuthorizeURL(scopes, state);
    res.redirect(html + "&show_dialog=true");
});

/**
 * Handles GET request for spotify/callback page
 */
router.get("/callback", async (req, res) => {
    if (req.query.state !== req.session.spotifyCallBackState) {
        return res.redirect("/#/error/state-mistmatch");
    }
    const {code} = req.query;
    return spotifyApi.authorizationCodeGrant(code)
        .then((data) => {
            const {access_token} = data.body;
            // only store access_token
            req.session.access_token = access_token;
            return res.redirect("/webcam");
        }).catch(() => {
            return res.redirect("/#/error/invalid-token");
        });
});

module.exports = router;
