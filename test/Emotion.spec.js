var chai = require("chai");
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");
const {Emotion} = require("../controllers/Emotion");
const sampleDataURL = require("./sampleDataURL");
const SpotifyWebApi = require('spotify-web-api-node');
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

    it("test sadness", async function () {
        let features = await emotion.getFeatures("sadness");
        console.log(features);
    });

    it("testing in general", async function () {
        let azureFaceAPI = new AzureFaceAPI();
        return azureFaceAPI.getEmotions(sampleDataURL.dataURL1).then((res) => {
            console.log(emotion.getDominantExpression(res));
        }).catch((err) => {
            console.log(err);
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

    it("testing refresh credential with invalid access token", async function() {
        try {
            emotion.spotifyApi.setAccessToken(expiredAccessToken);
            emotion.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
            await emotion.getFeatures("happiness");
            chai.expect(expiredAccessToken).to.not.equal(emotion.spotifyApi.getAccessToken());
        } catch(e) {
            console.log(e);
            chai.expect.fail();
        }
    });
});
