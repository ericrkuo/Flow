let path = require("path");
function getAbsolutePath() {
    return path.join(__dirname + "/webcam.html");
}

module.exports.getAbsolutePath = getAbsolutePath;