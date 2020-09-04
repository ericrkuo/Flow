var chai = require("chai");
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");
const {Emotion} = require("../controllers/Emotion");
const sampleDataURL = require("./sampleDataURL");
const SpotifyWebApi = require('spotify-web-api-node');
const {InvalidInputError} = require("../controllers/Error");
const {RefreshCredential} = require("../controllers/RefreshCredential");

let emotion;
let expiredAccessToken = "BQAbGNeDb2Dzq_jKEF6HnKbx4LE9e1nmhh8JKLRJYB0bUXjdYyFZXpY0xDbNs5j9CgdsJ4i04uChEQubQUT7Fwx_q-72rqHmlhT-yongaIVtkENGEesDRS4lp7zFv4G1OFSWPa6aHy6_XvAdvqQBVr_1dIoPz7FjVXmVo3yfFMjmwCzxYZvP3bQn2B-lqa56-38DlSSeAhtHZca5Z9V4-MhjR_e2gf_FlfFCsFhVdS71NBCvLwR_Ty1jxg_JDTaWeCByukgP37mmVjnyVFE";

describe("unit test for Spotify", function () {
    before(async function () {
        try {
            require('dotenv').config();
            let spotifyApi = new SpotifyWebApi({
                clientId: process.env.SPOTIFY_API_ID,
                clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
                redirectUri: process.env.CALLBACK_URL,
                refreshToken: process.env.REFRESH_TOKEN,
            });
            let refreshCredential = new RefreshCredential(spotifyApi);
            await refreshCredential.handleRefreshCredential(null, null);
            emotion = new Emotion(spotifyApi);
        } catch (e) {
            console.log(e);
        }
    });

    it("test getFeatures - sadness", async function () {
        let features = await emotion.getFeatures("sadness");
        console.log(features);
    });

    it("test getFeatures - integrated with AzureFaceAPI", async function () {
        let azureFaceAPI = new AzureFaceAPI();
        return azureFaceAPI.getEmotions(sampleDataURL.dataURL1).then((res) => {
            console.log(emotion.getDominantExpression(res));
        }).catch((err) => {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        })
    });

    it("test getFeatures - multiple emotions", async function () {
        try {
            let emotions = ["anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"];
            for (let e of emotions) {
                let features = await emotion.getFeatures(e);
                console.log(e + " - " + JSON.stringify(features));
                chai.assert(typeof features === 'object');
            }
        } catch (e) {
            chai.expect.fail("Should not have thrown error");
        }
    });

    it("test getFeatures - null input", async function () {
        try {
            await emotion.getFeatures(null);
            chai.expect.fail("Should not have reached here");
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(InvalidInputError);
        }
    });

    it("test getFeatures - undefined input", async function () {
        try {
            await emotion.getFeatures(undefined);
            chai.expect.fail("Should not have reached here");
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(InvalidInputError);
        }
    });

    it("test getFeatures - unrecognized input", async function () {
        try {
            await emotion.getFeatures("happpiness");
            chai.expect.fail("Should not have reached here");
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(InvalidInputError);
        }
    });

    it("test refresh credential with invalid access token", async function () {
        try {
            emotion.spotifyApi.setAccessToken(expiredAccessToken);
            emotion.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
            await emotion.getFeatures("happiness");
            chai.expect(expiredAccessToken).to.not.equal(emotion.spotifyApi.getAccessToken());
        } catch (e) {
            console.log(e);
            chai.expect.fail();
        }
    });

    it("test getDominantExpressions", async function () {
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

    it("test getDominantExpressions - invalid input null", async function () {
        try {
            emotion.getDominantExpression(null);
            chai.expect.fail();
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(InvalidInputError);
        }
    });

    it("test getDominantExpressions - invalid input wrong type", async function () {
        try {
            emotion.getDominantExpression("null");
            chai.expect.fail();
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(InvalidInputError);
        }
    });

    it("test getDominantExpressions - invalid input array", async function () {
        try {
            emotion.getDominantExpression([]);
            chai.expect.fail();
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(InvalidInputError);
        }
    });
});
