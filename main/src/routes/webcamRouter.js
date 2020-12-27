const express = require("express");
const {Main} = require("../Main");
const {webcamLimiter} = require("./rateLimiter");
const {checkCredentials, checkWebcamPostBody} = require("./middleware");
const router = express.Router();

/**
 * Handles GET request for webcam page
 */
router.get("/", checkCredentials, function (req, res) {
    // res.sendFile(path.join(__dirname+"/webcam.html"), {json: json});
    // res.sendFile(absolutePath.getAbsolutePath());
    return res.render("webcam");
});

/**
 * Handles POST request for webcam page to get relevant songs for user
 */
router.post("/", [webcamLimiter, checkCredentials, checkWebcamPostBody], function (req, res) {
    const main = new Main();
    main.dataURL = req.body.dataURL;
    main.spotifyApi.setAccessToken(req.session.access_token);
    return main.getRelevantSongsTestingPurposes()
        .then((result) => {
            if (result) {
                req.session.result = result;
                return res.status(200).json({result: result});
            } else {
                return res.status(404).json({errorMsg: "Please try taking another photo!"});
            }
        })
        .catch((err) => {
            return res.status(500).json({errorMsg: "Please try taking another photo! </br> </br>" + err.message});
        });
});

module.exports = router;
