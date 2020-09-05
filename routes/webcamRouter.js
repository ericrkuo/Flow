var express = require('express');
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

router.post('/', function (req, res, next) {
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