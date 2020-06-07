var express = require('express');
var router = express.Router();
const {Main} =  require("../controllers/Main");

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.sendFile(path.join(__dirname+"/webcam.html"), {json: json});
    // res.sendFile(absolutePath.getAbsolutePath());
    console.log(req.app.locals.globalString);
    res.render("webcam");
});

router.post('/', function (req, res, next) {
    req.app.locals.main.dataURL = req.body;
    return req.app.locals.main.getRelevantSongsTestingPurposes()
        .then((tracks)=>{
            console.log("REACHED HERE");
            // res.redirect("http://localhost:3000/tracks") // cannot do redirect after HTTP REQ, can only make client redirect
            // TODO: send back link in json for the frontend to change URL to
            return res.status(200).json("success!");
        })
        .catch((err)=>{
            console.log(err);
            return res.status(400).json({"error" : err});
        });
    // for (let i = 0; i<1000000000; i++) {
    //
    // }
    // return res.status(200).json("success!");
});

module.exports = router;