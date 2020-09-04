var express = require('express');
const {webcamLimiter} = require("./rateLimiter");
const {checkCredentials} = require("./indexRouter");
var router = express.Router();
const {Main} = require("../controllers/Main");

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.sendFile(path.join(__dirname+"/webcam.html"), {json: json});
    // res.sendFile(absolutePath.getAbsolutePath());

    return checkCredentials(req)
        .then((isCredentialValid) => {
            if (isCredentialValid) {
                return res.render("webcam");
            } else {
                return res.redirect("/spotify/login");
            }
        })
        .catch((err) => {
            // TODO: just in case checkCredentials throws an error (highly unlikely)
            console.log(err);
        })
});

router.post('/', webcamLimiter, function (req, res, next) {
    if (req.app.locals.main && req.body && req.body.dataURL) {
        let main = req.app.locals.main;
        main.dataURL = req.body.dataURL;
        return main.getRelevantSongsTestingPurposes()
            .then((tracks) => {
                console.log("REACHED HERE");
                // TODO if statement for result
                // res.redirect("/tracks") // cannot do redirect after HTTP REQ, can only make client redirect
                return res.status(200).json({result: req.app.locals.main.result});
            })
            .catch((err) => {
                return res.status(502).json({"error" : err.message});
            });
    } else {
        return res.status(500).json({message: "null or undefined main, data body or URL"});
    }
});

module.exports = router;