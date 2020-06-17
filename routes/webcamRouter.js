var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // res.sendFile(path.join(__dirname+"/webcam.html"));
    // res.sendFile(absolutePath.getAbsolutePath());
    res.render("webcam");
});

router.post('/', function (req, res, next) {
     // console.log(req.body);
    // res.status(200).json({msg: p.print(req.body)});

    let dataURL = req.body;
    let main = req.app.locals.main;
    main.dataURL = req.body;
    return main.getRelevantSongsTestingPurposes()
        .then(()=>{
            console.log("REACHED HERE");
            // res.redirect("http://localhost:3000/tracks") // cannot do redirect after HTTP REQ, can only make client redirect
            // TODO: send back link in json for the frontend to change URL to
            return res.status(200).json("success!");
        })
        .catch((err)=>{
            console.log(err);
            return res.status(400).json({"error" : err});
        });
});

module.exports = router;