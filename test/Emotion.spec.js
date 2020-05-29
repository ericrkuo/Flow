var chai = require("chai");
const request = require('request');
const {Emotion} = require("../controllers/Emotion");
var sampleDataURL = require("./sampleDataURL");
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");

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
        return azureFaceAPI.getEmotions(sampleDataURL.dataURL2).then((res)=>{
            emotion.getDominantExpression(res);
            chai.assert(true);
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
        });
    });


});
