var express = require('express');
var router = express.Router();
const {Spotify} = require("../controllers/Spotify");
const {Emotion} = require("../controllers/Emotion");

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

require('dotenv').config();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', (req, res) => {
    let spotifyApi = req.app.locals.main.spotifyApi
    let html = spotifyApi.createAuthorizeURL(scopes);
    console.log(html);
    res.redirect(html + "&show_dialog=true")
});

router.get('/callback', async (req, res) => {
    // TODO: callback not safe, need to use implement random hash string to encrypt callback, look at Spotify docs
    let spotifyApi = req.app.locals.main.spotifyApi
    const {code} = req.query;
    console.log(code);
    try {
        var data = await spotifyApi.authorizationCodeGrant(code);
        const {access_token, refresh_token} = data.body;
        req.app.locals.main.spotify = new Spotify(spotifyApi, access_token, refresh_token);
        console.log("SPOTIFY - set access and refresh tokens");
        console.log("ACCESS TOKEN: " + req.app.locals.main.spotify.spotifyApi.getAccessToken());
        console.log("\n");
        console.log("REFRESH TOKEN: " + req.app.locals.main.spotify.spotifyApi.getRefreshToken());
        res.redirect('/webcam');
    } catch (err) {
        res.redirect('/#/error/invalid token');
    }
});

module.exports = router;