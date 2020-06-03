var chai = require("chai");
var sampleDataURL = require("./sampleDataURL");
const request = require('request');
const {Track} = require("../controllers/Track");

describe("unit test for dataURL", function () {

    before(function () {
        require('dotenv').config();
    });

    it("test using chai expect ", function () {
        console.log(Track.tracks);
    });

});
