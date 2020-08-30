var express = require('express');
const {checkCredentials} = require("./indexRouter");
var router = express.Router();
const {Main} =  require("../controllers/Main");

/* GET home page. */
router.get('/', async function(req, res, next) {
    // res.sendFile(path.join(__dirname+"/webcam.html"), {json: json});
    // res.sendFile(absolutePath.getAbsolutePath());

    let isCredentialValid = await checkCredentials(req);
    if(isCredentialValid) {
        res.render("webcam");
    } else {
        res.redirect("/spotify/login");
    }
});

router.post('/', function (req, res, next) {
    let main = req.app.locals.main;
    main.dataURL = req.body;
    return main.getRelevantSongsTestingPurposes()
        .then((tracks)=>{
            // TODO: make POST more semantically correct
            console.log("REACHED HERE");
            // res.redirect("/tracks") // cannot do redirect after HTTP REQ, can only make client redirect
            return res.status(200).json({result: req.app.locals.main.result});
        })
        .catch((err)=>{
            console.log(err);
            return res.status(400).json({"error" : err.message});
        });
});

module.exports = router;