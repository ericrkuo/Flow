var express = require('express');
let qs = require('querystring');
var router = express.Router();

scopes = ['user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-recently-played',
    'user-top-read',
    'user-library-read',
    'user-follow-read',
    'playlist-read-private',
    'user-read-private',
    'playlist-read-collaborative'];

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let stateKey = 'spotify_auth_state';

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', (req, res) => {
    let spotifyApi = req.app.locals.main.spotifyApi
    let html = spotifyApi.createAuthorizeURL(scopes);
    console.log(html);

    let state = generateRandomString(16);
    res.cookie(stateKey, state);
    res.redirect(html + "&state=" + state + "&show_dialog=true")
});

router.get('/callback', async (req, res) => {
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            qs.stringify({
                error: 'state_mismatch'
            }));
        return;
    }

    let spotifyApi = req.app.locals.main.spotifyApi
    const {code} = req.query;
    console.log(code);
    try {
        var data = await spotifyApi.authorizationCodeGrant(code);
        const {access_token, refresh_token} = data.body;
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        console.log("SPOTIFY - set access and refresh tokens");
        console.log("ACCESS TOKEN: " + req.app.locals.main.spotifyService.spotifyApi.getAccessToken());
        console.log("\n");
        console.log("REFRESH TOKEN: " + req.app.locals.main.spotifyService.spotifyApi.getRefreshToken());
        res.redirect('/webcam');
    } catch (err) {
        res.redirect('/#/error/invalid token');
    }
});

module.exports = router;