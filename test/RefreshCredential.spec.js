const chai = require("chai");
const SpotifyWebApi = require('spotify-web-api-node');
const Err = require("../controllers/Error");
const {Emotion} = require("../controllers/Emotion");
const {Spotify} = require("../controllers/Spotify");
const {RefreshCredential} = require("../controllers/RefreshCredential");

let emotion;
let spotify;
let refreshCredential;
let spotifyApi;
let expiredAccessToken = "BQAbGNeDb2Dzq_jKEF6HnKbx4LE9e1nmhh8JKLRJYB0bUXjdYyFZXpY0xDbNs5j9CgdsJ4i04uChEQubQUT7Fwx_q-72rqHmlhT-yongaIVtkENGEesDRS4lp7zFv4G1OFSWPa6aHy6_XvAdvqQBVr_1dIoPz7FjVXmVo3yfFMjmwCzxYZvP3bQn2B-lqa56-38DlSSeAhtHZca5Z9V4-MhjR_e2gf_FlfFCsFhVdS71NBCvLwR_Ty1jxg_JDTaWeCByukgP37mmVjnyVFE";

//NOTE** Need to update process.env.ACCESS_TOKEN before running tests
describe("test checking credentials", function () {

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


    it("test checkCredentials Spotify", function () {
        return spotify.refreshCredential.checkCredentials().then((result) => {
            chai.assert(result);
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
        });
    });

    it("test checkCredentials Emotion", function () {
        return emotion.refreshCredential.checkCredentials().then((result) => {
            chai.assert(result);
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
        });
    });

    it("test checkCredentials RefreshCredential", function () {
        return refreshCredential.checkCredentials().then((result) => {
            chai.assert(result);
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
        });
    });

    it("test checkCredentials - expired access token for Spotify", function () {
        spotify.spotifyApi.setAccessToken(expiredAccessToken);
        return spotify.refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
        });
    });

    it("test checkCredentials - expired access token for Emotion", function () {
        emotion.spotifyApi.setAccessToken(expiredAccessToken);
        return emotion.refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
        });
    });

    it("test checkCredentials - expired access token for RefreshCredential", function () {
        refreshCredential.spotifyApi.setAccessToken(expiredAccessToken);
        return refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
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

    it("test refreshCredential - null spotifyApi", function () {
        try {
            let sampleRefreshCredential = new RefreshCredential(null);
            chai.expect.fail("supposed to fail");
        } catch (e) {
            console.log("Caught error" + e);
            chai.expect(e.message).to.equal("spotifyApi is null or undefined");
        }
    });

    it("test refreshCredential - no refresh token", function () {
        spotifyApi.setRefreshToken(undefined);
        return refreshCredential.tryRefreshCredential()
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((e) => {
                console.log("Caught error" + e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test refreshCredential - expect success", function () {
        let oldAccessToken = spotifyApi.getAccessToken();
        return refreshCredential.tryRefreshCredential()
            .then((newAccessToken) => {
                chai.expect(oldAccessToken).to.not.equal(newAccessToken);
            })
            .catch((e) => {
                console.log("Caught error" + e);
                chai.expect.fail("not supposed to fail");
            })
    });

    it("test refreshing once with invalid credentials for Spotify", function () {
        spotifyApi.setAccessToken(expiredAccessToken);
        return spotify.addRecentlyPlayedTracks()
            .then(() => {
                chai.expect(expiredAccessToken).to.not.equal(spotify.spotifyApi.getAccessToken());
            }).catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            })
    });

    it("test refreshing once with invalid credentials for Emotion", function () {
        spotifyApi.setAccessToken(expiredAccessToken);
        return emotion.getFeatures("happiness")
            .then(() => {
                chai.expect(expiredAccessToken).to.not.equal(emotion.spotifyApi.getAccessToken());
            }).catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            })
    });
});