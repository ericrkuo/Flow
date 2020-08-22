const chai = require("chai");
const SpotifyWebApi = require('spotify-web-api-node');
const {Emotion} = require("../controllers/Emotion");
const {Spotify} = require("../controllers/Spotify");
const {RefreshCredential} = require("../controllers/RefreshCredential");

let emotion;
let spotify;
let refreshCredential;
let spotifyApi;

describe("test checking credentials", async function () {

    beforeEach(function () {
        require('dotenv').config();
        spotify = new Spotify(process.env.ACCESS_TOKEN, process.env.REFRESH_TOKEN);
        emotion = new Emotion();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
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
            chai.expect.fail("did not expect fail");
        });
    });

    it("test checking invalid credentials for Spotify", async function () {
        spotify.spotifyApi.setAccessToken(process.env.EXPIRED_ACCESS_TOKEN);
        return spotify.refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail("did not expect fail");
        });
    });

    it("test checking invalid credentials for Emotion", async function () {
        emotion.spotifyApi.setAccessToken(process.env.EXPIRED_ACCESS_TOKEN);
        return emotion.refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail("did not expect fail");
        });
    });

    it("test checking invalid credentials for Refresh Credential", async function () {
        refreshCredential.spotifyApi.setAccessToken(process.env.EXPIRED_ACCESS_TOKEN);
        return refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            chai.expect.fail("did not expect fail");
        });
    });

});


describe("test refreshing with credentials", function () {

    beforeEach(function () {
        require('dotenv').config();
        spotify = new Spotify(process.env.ACCESS_TOKEN, process.env.REFRESH_TOKEN);
        emotion = new Emotion();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        spotifyApi.setAccessToken(process.env.EXPIRED_ACCESS_TOKEN);
        spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        refreshCredential = new RefreshCredential(spotifyApi);
    })


    it("test refreshing once with invalid credentials for Spotify", async function() {
        let oldCredentials = spotify.spotifyApi.getAccessToken();
        let err = new Error("ERROR OCCURRED")
        return spotify.refreshCredential.refreshCredential(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            chai.expect(oldCredentials).to.not.equal(spotify.spotifyApi.getAccessToken());
        }).catch((err) => {
            console.log(err);
            chai.expect.fail();
        })
    });

    it("test refreshing once with invalid credentials for Emotion", async function() {
        emotion.spotifyApi.setAccessToken(process.env.EXPIRED_ACCESS_TOKEN);
        let oldCredentials = emotion.spotifyApi.getAccessToken();
        emotion.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        let err = new Error("ERROR OCCURRED")

        return emotion.refreshCredential.refreshCredential(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            chai.expect(oldCredentials).to.not.equal(spotify.spotifyApi.getAccessToken());
        }).catch((err) => {
            console.log(err);
            chai.expect.fail();
        })
    });

    it("test refreshing once with invalid credentials for RefreshCredential", async function() {
        let oldCredentials = refreshCredential.spotifyApi.getAccessToken();
        let err = new Error("ERROR OCCURRED")

        return refreshCredential.refreshCredential(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            chai.expect(oldCredentials).to.not.equal(spotify.spotifyApi.getAccessToken());
        }).catch((err) => {
            console.log(err);
            chai.expect.fail();
        })
    });


});



