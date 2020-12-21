var chai = require("chai");
const {AzureFaceAPIService} = require("../../src/service/AzureFaceAPIService");
const {EmotionService} = require("../../src/service/EmotionService");
const sampleDataURL = require("../resources/sampleDataURL");
const SpotifyWebApi = require('spotify-web-api-node');
const Err = require("../../src/constant/Error");
const {RefreshCredentialService} = require("../../src/service/RefreshCredentialService");

let emotionService;

describe("unit test for EmotionService", function () {
    before(async function () {
        require('dotenv').config();
        let spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
            refreshToken: process.env.REFRESH_TOKEN,
        });
        emotionService = new EmotionService(spotifyApi);
        let refreshCredentialService = new RefreshCredentialService(spotifyApi);
        await refreshCredentialService.tryRefreshCredential()
    });

    it("test getFeatures - sadness", function () {
        return emotionService.getFeatures("sadness")
            .then((features) => {
                console.log(features);
                chai.assert(typeof features === 'object');
            })
            .catch((err) => {
                chai.expect.fail("not supposed to fail");
            })
    });

    it("test getFeatures - multiple emotions", function () {
        let emotions = ["anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"];
        let promises = [];
        for (let e of emotions) {
            promises.push(emotionService.getFeatures(e));
        }
        return Promise.all(promises)
            .then((resArray) => {
                chai.expect(resArray.length).to.be.equal(emotions.length);
                for (let res of resArray) {
                    console.log(res);
                    chai.assert(typeof res === 'object');
                }
            })
            .catch((e) => {
                chai.expect.fail("not supposed to fail");
            })
    });

    it("test getFeatures - null input", function () {
        return emotionService.getFeatures(null)
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getFeatures - undefined input", function () {
        return emotionService.getFeatures(undefined)
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getFeatures - wrong input type", function () {
        return emotionService.getFeatures(2)
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getFeatures - unrecognized input", function () {
        return emotionService.getFeatures("happpiness")
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getDominantExpression - integrated with AzureFaceAPIService", function () {
        let azureFaceAPIService = new AzureFaceAPIService();
        return azureFaceAPIService.getEmotions(sampleDataURL.dataURL1)
            .then((res) => {
                let dominantExpression = emotionService.getDominantExpression(res);
                chai.expect(dominantExpression).to.be.equal("neutral");
                console.log(dominantExpression);
            }).catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            })
    });

    it("test getDominantExpressions", function () {
        try {
            let data = {
                anger: 0,
                contempt: 0,
                disgust: 0,
                fear: 0,
                happiness: 0,
                neutral: 0.999,
                sadness: 0,
                surprise: 0
            };
            let result = emotionService.getDominantExpression(data);
            chai.expect(result).to.be.equal("neutral");
        } catch (e) {
            console.log(e);
            chai.expect.fail("not supposed to fail");
        }
    });

    it("test getDominantExpressions - invalid input null", function () {
        try {
            emotionService.getDominantExpression(null);
            chai.expect.fail("supposed to fail");
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    });

    it("test getDominantExpressions - invalid input wrong type", function () {
        try {
            emotionService.getDominantExpression("null");
            chai.expect.fail("supposed to fail");
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    });

    it("test getDominantExpressions - invalid input array", function () {
        try {
            emotionService.getDominantExpression([]);
            chai.expect.fail("supposed to fail");
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    });
});
