var express = require('express');
const {Main} = require("../controllers/Main");
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


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', (req, res) => {
    if (!req.app.locals.main || !req.app.locals.main.spotifyApi) {
        req.app.locals.main = new Main();
    }

    let spotifyApi = req.app.locals.main.spotifyApi
    let html = spotifyApi.createAuthorizeURL(scopes);
    console.log(html);
    res.redirect(html + "&show_dialog=true");

});

router.get('/callback', async (req, res, next) => {
    // TODO: callback not safe, need to use implement random hash string to encrypt callback, look at Spotify docs

    let main = req.app.locals.main;

    if (!main || !main.spotifyApi || !main.spotify) {
        req.app.locals.main = new Main();
    }

    let spotifyApi = req.app.locals.main.spotifyApi;
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
            return res.redirect('/webcam');
        }).catch((err) => {
            return res.redirect('#/error/invalid-token');
        });

});

module.exports = router;