var chai = require("chai");
const request = require('request');
const {Emotion} = require("../controllers/Emotion");

let emotion;
describe("unit test for Spotify", function () {
    before(function () {
        emotion = new Emotion();
        require('dotenv').config();
    });

    it("test sadness", async function () {
        let features = await emotion.getFeatures("sadness");
        console.log(features);
    });


});
