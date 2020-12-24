var express = require('express');
const {Main} = require("../Main");
var router = express.Router();

/**
 * Handles GET request for index page
 */
router.get('/', function (req, res, next) {
    res.render('index', null);
});

module.exports = router;
