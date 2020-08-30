var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', null);
});

async function checkCredentials(req) {
    let main = req.app.locals.main;
    if (main && main.spotify && main.spotify.spotifyApi) {
        let accessToken = req.app.locals.main.spotify.spotifyApi.getAccessToken();
        let refreshToken = req.app.locals.main.spotify.spotifyApi.getRefreshToken();
        let result = await main.spotify.checkCredentials();
        if (accessToken && refreshToken && typeof accessToken === 'string' && typeof refreshToken === 'string' && result) {
            return true;
        }
    }
    return false;
}

module.exports = router;
module.exports.checkCredentials = checkCredentials;
