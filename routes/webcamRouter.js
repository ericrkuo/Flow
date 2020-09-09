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
            res.redirect("/spotify/login");
        })
});

router.post('/', webcamLimiter, function (req, res, next) {
    let main = req.app.locals.main;

    return res.status(404).json({errorMsg: "Please try taking another photo"});


    if (main && req.body && req.body.dataURL) {
        let main = req.app.locals.main;
        main.dataURL = req.body.dataURL;
        return main.getRelevantSongsTestingPurposes()
            .then((tracks) => {
                console.log("REACHED HERE");
                let result = main.result;
                if (result) {
                    return res.status(200).json({result: result});
                } else {
                    return res.status(404).json({errorMsg: "Please try taking another photo"});
                }
            })
            .catch((err) => {
                return res.status(500).json({errorMsg: "Please try taking another photo. </br> </br>" + err.message});
            });
    } else if (!main) {
        req.app.locals.main = new Main();
        return res.status(404).json({errorMsg: "Redirecting you in 5 seconds...", redirectLink: '/spotify/login'});
    } else if (!req.body || !req.body.dataURL) {
        return res.status(404).json({errorMsg: "Please try taking another photo"});
    }
});

module.exports = router;