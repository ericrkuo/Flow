var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express!!', test: "HELLOOOOOOOO"});
});

router.get('/credentials', function(req, res, next) {
  let accessToken = req.app.locals.main.spotify.spotifyApi.getAccessToken();
  let refreshToken = req.app.locals.main.spotify.spotifyApi.getRefreshToken();
  console.log("ACCESS: " + accessToken);
  console.log("REFRESH: " + refreshToken);
  if (typeof accessToken == "string" && typeof refreshToken == "string") {
    res.status(200).send({result: true})
  } else {
    res.status(200).send({result: false})
  }
});

module.exports = router;
