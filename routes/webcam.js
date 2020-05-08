var express = require('express');
var p = require('../test');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.sendFile(path.join(__dirname+"/webcam.html"));
    // res.sendFile(absolutePath.getAbsolutePath());
    res.render("webcam");
});

router.post('/', function (req, res) {
    res.send(p.print());
    res.status(200).json(p.print());
});

module.exports = router;