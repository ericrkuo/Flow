var chai = require("chai");
const request = require('request');
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");
const {Emotion} = require("../controllers/Emotion");
const sampleDataURL = require("./sampleDataURL");

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

    it("testing in general", async function () {
        let azureFaceAPI = new AzureFaceAPI();
        return azureFaceAPI.getEmotions(sampleDataURL.dataURL2).then((res) => {
            console.log(emotion.getDominantExpression(res));
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
        })
    });

    it("test emotions", async function () {
        let emotions = ["happiness" , "sadness", "neutral"];
        for (let e of emotions) {
            let features = await emotion.getFeatures(e);
            console.log(features);
        }
    });

});