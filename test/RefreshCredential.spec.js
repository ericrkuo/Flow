const chai = require("chai");
const SpotifyWebApi = require('spotify-web-api-node');
const {Emotion} = require("../controllers/Emotion");
const {Spotify} = require("../controllers/Spotify");
const {RefreshCredential} = require("../controllers/RefreshCredential");

let emotion;
let spotify;
let refreshCredential;
let spotifyApi;
let expiredAccessToken = "BQAbGNeDb2Dzq_jKEF6HnKbx4LE9e1nmhh8JKLRJYB0bUXjdYyFZXpY0xDbNs5j9CgdsJ4i04uChEQubQUT7Fwx_q-72rqHmlhT-yongaIVtkENGEesDRS4lp7zFv4G1OFSWPa6aHy6_XvAdvqQBVr_1dIoPz7FjVXmVo3yfFMjmwCzxYZvP3bQn2B-lqa56-38DlSSeAhtHZca5Z9V4-MhjR_e2gf_FlfFCsFhVdS71NBCvLwR_Ty1jxg_JDTaWeCByukgP37mmVjnyVFE";

//NOTE** Need to update process.env.ACCESS_TOKEN before running tests
describe("test checking credentials", async function () {

    beforeEach(function () {
        require('dotenv').config();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        spotify = new Spotify(spotifyApi);
        emotion = new Emotion(spotifyApi);
        refreshCredential = new RefreshCredential(spotifyApi);
    })


    it("test checking valid credentials for Spotify", async function () {
        return spotify.refreshCredential.checkCredentials().then((result) => {
            chai.assert(result);
        }).catch((err) => {
            chai.expect.fail("did not expect fail");
        });
    });

    it("test checking valid credentials for Emotion", async function () {
        return emotion.refreshCredential.checkCredentials().then((result) => {
            chai.assert(result);
        }).catch((err) => {
            chai.expect.fail("did not expect fail");
        });
    });

    it("test checking valid credentials for RefreshCredential", async function () {
        return refreshCredential.checkCredentials().then((result) => {
            chai.assert(result);
        }).catch((err) => {
            chai.expect.fail();
        });
    });

    it("test checking invalid credentials for Spotify", async function () {
        spotify.spotifyApi.setAccessToken(expiredAccessToken);
        return spotify.refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail();
        });
    });

    it("test checking invalid credentials for Emotion", async function () {
        emotion.spotifyApi.setAccessToken(expiredAccessToken);
        return emotion.refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail();
        });
    });

    it("test checking invalid credentials for Refresh Credential", async function () {
        refreshCredential.spotifyApi.setAccessToken(expiredAccessToken);
        return refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail();
        });
    });

});


describe("test refreshing with credentials", function () {

    beforeEach(function () {
        require('dotenv').config();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        spotify = new Spotify(spotifyApi);
        emotion = new Emotion(spotifyApi);
        refreshCredential = new RefreshCredential(spotifyApi);
    });

    it("testing refreshCredential with null spotifyApi", async function() {
        try {
            let sampleRefreshCredential = new RefreshCredential(null);
            chai.expect.fail();
        } catch(e) {
            console.log("Caught error" + e);
            chai.expect(e.message).to.equal("spotifyApi is null or undefined");
        }
    });


    it("test refreshing once with invalid credentials for Spotify", async function() {
        let err = new Error("ERROR OCCURRED");
        return spotify.refreshCredential.refreshCredential(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            chai.expect(expiredAccessToken).to.not.equal(spotify.spotifyApi.getAccessToken());
        }).catch((err) => {
            console.log(err);
            chai.expect.fail();
        })
    });

    it("test refreshing once with invalid credentials for Emotion", async function() {
        emotion.spotifyApi.setAccessToken(expiredAccessToken);
        emotion.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        let err = new Error("ERROR OCCURRED");
        return emotion.refreshCredential.refreshCredential(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            chai.expect(expiredAccessToken).to.not.equal(spotify.spotifyApi.getAccessToken());
        }).catch((err) => {
            console.log(err);
            chai.expect.fail();
        })
    });

    it("test refreshing once with invalid credentials for RefreshCredential", async function() {
        let err = new Error("ERROR OCCURRED");
        return refreshCredential.refreshCredential(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            chai.expect(expiredAccessToken).to.not.equal(spotify.spotifyApi.getAccessToken());
        }).catch((err) => {
            console.log(err);
            chai.expect.fail();
        });
    });
});



