var express = require('express');
var router = express.Router();
var path = require('path');
var absolutePath = require('../views/absolutePath')

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.sendFile(path.join(__dirname+"/webcam.html"));
    res.sendFile(absolutePath.getAbsolutePath());
    // res.render("webcam");
});
module.exports = router;