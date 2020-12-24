var express = require('express');
var router = express.Router();

/**
 * Handles GET request for tutorial page
 */
router.get('/', function(req, res, next) {
    res.render('tutorial');
});

module.exports = router;
