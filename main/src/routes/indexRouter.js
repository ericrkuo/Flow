const express = require("express");
const router = express.Router();

/**
 * Handles GET request for index page
 */
router.get("/", function (req, res) {
    res.render("index", null);
});

module.exports = router;
