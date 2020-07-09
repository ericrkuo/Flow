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
            return res.status(200).json({link: "http://localhost:3000/tracks", result: req.app.locals.main.result});
        })
        .catch((err)=>{
            console.log(err);
            return res.status(400).json({"error" : err});
        });
});

module.exports = router;