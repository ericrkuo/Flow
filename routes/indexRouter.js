var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', null);
});

router.get('/credentials', async function(req, res, next) {
  let accessToken = req.app.locals.main.spotify.spotifyApi.getAccessToken();
  let refreshToken = req.app.locals.main.spotify.spotifyApi.getRefreshToken();
  let result = await req.app.locals.main.spotify.checkCredentials();
  console.log("ACCESS: " + accessToken);
  console.log("REFRESH: " + refreshToken);
  if (typeof accessToken == "string" && typeof refreshToken == "string" && result) {
    res.status(200).send({result: true})
  } else {
    res.status(200).send({result: false})
  }
});

module.exports = router;
