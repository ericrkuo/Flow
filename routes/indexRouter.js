var express = require('express');
const {Main} = require("../controllers/Main");
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', null);
});

function checkCredentials(req) {
    let main = req.app.locals.main;
    if (!main || !main.spotify || !main.spotifyApi || !main.spotify.refreshCredential) {
        req.app.locals.main = new Main();
        return Promise.resolve(false);
    }

    return main.spotify.refreshCredential.checkCredentials()
        .then((result) => {
            let accessToken = main.spotifyApi.getAccessToken();
            let refreshToken = main.spotifyApi.getRefreshToken();
            return (accessToken && refreshToken && typeof accessToken === 'string' && typeof refreshToken === 'string' && result);
        })
        .catch((err) => {
            throw err;
        })
}

module.exports = router;
module.exports.checkCredentials = checkCredentials;
