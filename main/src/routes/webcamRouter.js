const express = require("express");
const {webcamLimiter} = require("./rateLimiter");
const {checkCredentials, refreshCredentialsIfExpired, checkWebcamPostBody} = require("./middleware");
const router = express.Router();

/* GET home page. */
router.get("/", checkCredentials, function (req, res) {
    // res.sendFile(path.join(__dirname+"/webcam.html"), {json: json});
    // res.sendFile(absolutePath.getAbsolutePath());
    return res.render("webcam");
});

router.post("/", [webcamLimiter, refreshCredentialsIfExpired, checkWebcamPostBody], function (req, res) {
    const main = req.app.locals.main;
    main.dataURL = req.body.dataURL;
    return main.getRelevantSongsTestingPurposes()
        .then(() => {
            console.log("REACHED HERE");
            const result = main.result;
            if (result) {
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