var chai = require("chai");
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");
const {Emotion} = require("../controllers/Emotion");
const sampleDataURL = require("./sampleDataURL");
const SpotifyWebApi = require('spotify-web-api-node');
const Err = require("../controllers/Error");

let emotion;

describe("unit test for Spotify", function () {
    before(function () {
        require('dotenv').config();
        let spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
            refreshToken: process.env.REFRESH_TOKEN,
        });
        emotion = new Emotion(spotifyApi);
    });

    it("test getFeatures - sadness", function () {
        return emotion.getFeatures("sadness")
            .then((features) => {
                console.log(features);
            })
            .catch((err) => {
                chai.expect.fail();
            })
    });

    it("test getFeatures - integrated with AzureFaceAPI", function () {
        let azureFaceAPI = new AzureFaceAPI();
        return azureFaceAPI.getEmotions(sampleDataURL.dataURL1).then((res) => {
            console.log(emotion.getDominantExpression(res));
        }).catch((err) => {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        })
    });

    it("test getFeatures - multiple emotions", function () {
        let emotions = ["anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"];
        return emotion.refreshCredential.tryRefreshCredential()
            .then(() => {
                let promises = [];
                for (let e of emotions) {
                    promises.push(emotion.getFeatures(e));
                }
                return Promise.all(promises);
            })
            .then((resArray) => {
                for (let res of resArray) {
                    chai.assert(typeof res === 'object');
                }
            })
            .catch((e) => {
                chai.expect.fail("Should not have thrown error");
            })
    });

    it("test getFeatures - null input", function () {
        return emotion.getFeatures(null)
            .then(() => {
                chai.expect.fail("Should not have reached here");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getFeatures - undefined input", function () {
        return emotion.getFeatures(undefined)
            .then(() => {
                chai.expect.fail("Should not have reached here");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getFeatures - wrong input type", function () {
        return emotion.getFeatures(2)
            .then(() => {
                chai.expect.fail("Should not have reached here");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getFeatures - unrecognized input", function () {
        return emotion.getFeatures("happpiness")
            .then(() => {
                chai.expect.fail("Should not have reached here");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
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
            let result = emotion.getDominantExpression(data);
            chai.expect(result).to.be.equal("neutral");
        } catch (e) {
            console.log(e);
            chai.expect.fail();
        }
    });

    it("test getDominantExpressions - invalid input null", function () {
        try {
            emotion.getDominantExpression(null);
            chai.expect.fail();
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    });

    it("test getDominantExpressions - invalid input wrong type", function () {
        try {
            emotion.getDominantExpression("null");
            chai.expect.fail();
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    });

    it("test getDominantExpressions - invalid input array", function () {
        try {
            emotion.getDominantExpression([]);
            chai.expect.fail();
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    });
});
