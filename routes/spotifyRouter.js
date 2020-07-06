var express = require('express');
var router = express.Router();
const {Spotify} = require("../controllers/Spotify");


var SpotifyWebApi = require('spotify-web-api-node');
scopes = ['user-read-private',
    'user-read-email',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-read-private',
    'user-top-read',
    'user-follow-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-read-recently-played'];

require('dotenv').config();

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_API_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.CALLBACK_URL,
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', (req,res) => {
    var html = spotifyApi.createAuthorizeURL(scopes);
    console.log(html);
    res.redirect(html+"&show_dialog=true")
});

router.get('/callback', async (req,res) => {
    // TODO: callback not safe, need to use implement random hash string to encrypt callback, look at Spotify docs
    const { code } = req.query;
    console.log(code);
    try {
        var data = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token } = data.body;

        req.app.locals.main.spotify = new Spotify(access_token, refresh_token);
        req.app.locals.main.emotion.spotifyApi = req.app.locals.main.spotify.spotifyApi;

        let str2 = "lalaa";
        str2.to


        // req.app.locals.main.spotify.spotifyApi.setAccessToken(access_token);
        // req.app.locals.main.spotify.spotifyApi.setRefreshToken(refresh_token);

        res.redirect('http://localhost:3000/webcam');
    } catch(err) {
        console.log(err);
        res.redirect('/#/error/invalid token');
    }
});

module.exports = router;