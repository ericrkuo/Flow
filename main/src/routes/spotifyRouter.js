const express = require("express");
const qs = require("querystring");
const {Main} = require("../Main");
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
 * @param  {number} length The length of the string
 * @return {string} The generated string
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

/* GET home page. */
router.get("/", function (req, res) {
    res.render("index", {title: "Express"});
});

router.get("/login", (req, res) => {
    let main = req.app.locals.main;

    if (!main || !main.spotifyApi) {
        req.app.locals.main = new Main();
        main = req.app.locals.main;
    }

    const spotifyApi = main.spotifyApi;
    const html = spotifyApi.createAuthorizeURL(scopes);
    console.log(html);

    const state = generateRandomString(16);
    res.cookie(stateKey, state);
    res.redirect(html + "&state=" + state + "&show_dialog=true");
});

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

    let main = req.app.locals.main;

    if (!main || !main.spotifyApi || !main.spotify) {
        req.app.locals.main = new Main();
        main = req.app.locals.main;
    }

    const spotifyApi = main.spotifyApi;
    const {code} = req.query;
    console.log(code);

    return spotifyApi.authorizationCodeGrant(code)
        .then((data) => {
            const {access_token, refresh_token} = data.body;
            spotifyApi.setAccessToken(access_token);
            spotifyApi.setRefreshToken(refresh_token);
            console.log("SPOTIFY - set access and refresh tokens");
            console.log("ACCESS TOKEN: " + spotifyApi.getAccessToken());
            console.log("\n");
            console.log("REFRESH TOKEN: " + spotifyApi.getRefreshToken());
            return res.redirect("/webcam");
        }).catch(() => {
            return res.redirect("/#/error/invalid-token");
        });
});

module.exports = router;