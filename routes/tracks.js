var express = require('express');
var router = express.Router();
const {Main} =  require("../controllers/Main")
const {Track} = require("../controllers/Track")
// input: dataURL
// output: returns html rendering of the tracks
router.get('/', function(req, res, next) {
    if (Track.tracks !== null) {
        res.render("tracks", {tracks: Track.tracks});
    } else {
        res.render("tracks", {tracks: ["song1", "song2", "song3"]})
    }
    // TODO: have to put something to replace else statement
});

module.exports = router;
