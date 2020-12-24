var express = require('express');
const {webcamLimiter} = require("./rateLimiter");
const {checkCredentials, refreshCredentialsIfExpired} = require("./middleware");
var router = express.Router();

/**
 * Handles GET request for webcam page
 */
router.get('/', checkCredentials, function (req, res, next) {
    // res.sendFile(path.join(__dirname+"/webcam.html"), {json: json});
    // res.sendFile(absolutePath.getAbsolutePath());
    return res.render("webcam");
});

/**
 * Handles POST request for webcam page
 */
router.post('/', [webcamLimiter, refreshCredentialsIfExpired], function (req, res, next) {
    if (req.app.locals.main && req.body && req.body.dataURL) {
        let main = req.app.locals.main;
        main.dataURL = req.body.dataURL;
        return main.getRelevantSongsTestingPurposes()
            .then((tracks) => {
                console.log("REACHED HERE");
                // res.redirect("/tracks") // cannot do redirect after HTTP REQ, can only make client redirect
                return res.status(200).json({result: req.app.locals.main.result});
            })
            .catch((err) => {
                // TODO: error handling in front end
                console.log(err);
                return res.status(400).json({"error": err.message});
            });
    } else {
        // TODO: error handling in front end
        return res.status(400).json({"error": "Something went wrong"});
    }
});

module.exports = router;