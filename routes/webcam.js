var express = require('express');
var p = require('../controllers/test');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.sendFile(path.join(__dirname+"/webcam.html"));
    // res.sendFile(absolutePath.getAbsolutePath());
    res.render("webcam");
});

router.post('/', function (req, res, next) {
    // console.log(req.body);

    res.status(200).json({msg: p.print(req.body)});
});

module.exports = router;