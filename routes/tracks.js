var express = require('express');
var router = express.Router();
const {Main} =  require("../controllers/Main")
// input: dataURL
// output: returns html rendering of the tracks
router.get('/', function(req, res, next) {
    if (Main.tracks !== null) {
        res.render("tracks", {tracks: Main.tracks});
    } else {
        res.render("tracks", {tracks: ["song1", "song2", "song3"]})
    }
    // TODO: have to put something to replace else statement
});

module.exports = router;
