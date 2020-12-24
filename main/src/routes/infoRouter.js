var express = require('express');
var router = express.Router();

/**
 * Handles GET request for info page
 */
router.get('/', function(req, res, next) {
    res.render('info');
});

module.exports = router;
