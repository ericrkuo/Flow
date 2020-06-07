var express = require('express');
var router = express.Router();

const {Spotify} = require("../controllers/Spotify");
const {Emotion} = require("../controllers/Emotion");
var SpotifyWebApi = require('spotify-web-api-node');
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

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URL,
});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/login', (req, res) => {
    var html = spotifyApi.createAuthorizeURL(scopes);
    console.log(html);
    res.redirect(html + "&show_dialog=true")
});

router.get('/callback', async (req, res) => {
    // TODO: callback not safe, need to use implement random hash string to encrypt callback, look at Spotify docs
    const {code} = req.query;
    console.log(code);
    try {
        var data = await spotifyApi.authorizationCodeGrant(code);
        const {access_token, refresh_token} = data.body;
        // spotifyApi.setAccessToken(access_token);
        // spotifyApi.setRefreshToken(refresh_token);
        // console.log("ACCESS TOKEN - "+ access_token);
        // console.log("\n");
        // console.log("REFRESH TOKEN - " + refresh_token);

        req.app.locals.main.spotify = new Spotify(access_token, refresh_token);
        req.app.locals.main.emotion.spotifyApi = req.app.locals.main.spotify.spotifyApi;


        console.log("SPOTIFY - set access and refresh tokens");
        console.log("ACCESS TOKEN: " + req.app.locals.main.spotify.spotifyApi.getAccessToken());
        console.log("\n");
        console.log("REFRESH TOKEN: " + req.app.locals.main.spotify.spotifyApi.getRefreshToken());
        res.redirect('http://localhost:3000/webcam');
    } catch (err) {
        res.redirect('/#/error/invalid token');
    }
});

module.exports = router;