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
        spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        refreshCredential = new RefreshCredential(spotifyApi);
    })


    it("test refreshing once with valid credentials for Spotify", async function() {
        let oldCredentials = spotify.spotifyApi.getAccessToken();
        console.log(oldCredentials);
        let err = new Error("ERROR OCCURRED")

        return spotify.refreshCredential.refreshCredentials(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            let newCredentials = spotify.spotifyApi.getAccessToken();
            console.log(newCredentials);
        }).catch((err) => {
            console.log(err);
        })
    });

    it("test refreshing once with valid credentials for Emotion", async function() {
        let oldCredentials = emotion.spotifyApi.getAccessToken();
        emotion.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        console.log(oldCredentials);
        let err = new Error("ERROR OCCURRED")

        return emotion.refreshCredential.refreshCredentials(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            let newCredentials = emotion.spotifyApi.getAccessToken();
            console.log(newCredentials);
        }).catch((err) => {
            console.log(err);
        })
    });

    it("test refreshing once with valid credentials for RefreshCredential", async function() {
        let oldCredentials = refreshCredential.spotifyApi.getAccessToken();
        refreshCredential.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        console.log(oldCredentials);
        let err = new Error("ERROR OCCURRED")

        return refreshCredential.refreshCredentials(function () {
            console.log("Reached function pointer!");
        }, err).then(() => {
            let newCredentials = refreshCredential.spotifyApi.getAccessToken();
            console.log(newCredentials);
        }).catch((err) => {
            console.log(err);
        })
    });

    it("test refreshing twice with valid credentials for Spotify", async function() {
        let errorOne = new Error("ERROR 1 THROWN");
        let errorTwo = new Error("ERROR 2 THROWN")

        return spotify.refreshCredential.refreshCredentials(function () {
            console.log("refreshed first time!");
        }, errorOne).then(() => {
            let oldCredentials = spotify.spotifyApi.getAccessToken();
             console.log("OLD TOKEN - " + oldCredentials);

            return spotify.refreshCredential.refreshCredentials(function () {
                console.log("this should not print!");
            }, errorTwo)

        }).catch((err) => {
            console.log("error on first refresh " + err);
        })

    });

    it("test refreshing twice with valid credentials for Emotion", async function() {
        let errorOne = new Error("ERROR 1 THROWN");
        let errorTwo = new Error("ERROR 2 THROWN")

        emotion.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);

        return emotion.refreshCredential.refreshCredentials(function () {
            console.log("refreshed first time!");
        }, errorOne).then(() => {
            let oldCredentials = emotion.spotifyApi.getAccessToken();
            console.log("OLD TOKEN - " + oldCredentials);

            return emotion.refreshCredential.refreshCredentials(function () {
                console.log("this should not print!");
            }, errorTwo)

        }).catch((err) => {
            console.log("error on first refresh " + err);
        })

    });

    it("test refreshing twice with valid credentials for RefreshCredential", async function() {
        let errorOne = new Error("ERROR 1 THROWN");
        let errorTwo = new Error("ERROR 2 THROWN")

        refreshCredential.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);

        return refreshCredential.refreshCredentials(function () {
            console.log("refreshed first time!");
        }, errorOne).then(() => {
            let oldCredentials = refreshCredential.spotifyApi.getAccessToken();
            console.log("OLD TOKEN - " + oldCredentials);

            return refreshCredential.refreshCredentials(function () {
                console.log("this should not print!");
            }, errorTwo)

        }).catch((err) => {
            console.log("error on first refresh " + err);
        })

    });

});



