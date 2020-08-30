var chai = require("chai");
const request = require('request');
const {Spotify} = require("../controllers/Spotify");
const SpotifyWebApi = require('spotify-web-api-node');

var spotify;
let spotifyApi;

describe("unit test for Spotify", function () {
    before(function () {
        require('dotenv').config();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
    });

    beforeEach(()=> {
        spotify = new Spotify(spotifyApi);
    });

    function printOutSongNames() {
        for (let track of spotify.trackHashMap.values()) {
            console.log(track.name);
        }
    }

    it("test tokens", async function () {
        spotify = new Spotify(spotifyApi, "hello");
        let x = spotify.spotifyApi.getAccessToken();
        chai.expect(x).to.be.equal("hello");
        let result = await spotify.checkCredentials()
        console.log(result);
    });

    it("test Sample Function", function () {
        return spotify.sampleFunction().then((res) => {
            console.log(JSON.stringify(res.body));
        }).catch((err) => {
            console.log(err);
            chai.expect.fail();
        });
    });

    it("get Recent Songs", async function () {
        return spotify.addRecentlyPlayedTracks()
            .then((res) => {
                console.log("# RECENT SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            });
    });

    it("get Top Tracks", async function () {
        return spotify.addTopTracks()
            .then((res) => {
                console.log("# TOP SONGS ADDED: " + spotify.trackHashMap.size);
                printOutSongNames();
                chai.assert(res);
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            });

    });

    it("get Top Artists", async function () {
        return spotify.addTopArtistsTracks()
            .then((res) => {
                console.log("# TOP ARTIST SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            });

    });

    it("add Saved tracks", async function () {
        return spotify.addSavedTracks()
            .then((res) => {
                console.log("# SAVED SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            });

    });

    it("get all sample data audio features", async function () {
        return spotify.getAllAudioFeatures()
            .then((res) => {
                // console.log(res);
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            });

    });


    // SEED TESTS

    function testSeedFunction(mood) {
        spotify.mood = mood;
        return spotify.addSeedTracks()
            .then((res) => {
                chai.assert(res);
                console.log("# RECENT SONGS ADDED: " + spotify.trackHashMap.size);
                printOutSongNames();
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            });
    }

    let emotions = ["anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"];

    it("anger - test seed data", async function () {
        return testSeedFunction("anger");
    });

    it("contempt - test seed data", async function () {
        return testSeedFunction("contempt");
    });

    it("disgust - test seed data", async function () {
        return testSeedFunction("disgust");
    });

    it("fear - test seed data", async function () {
        return testSeedFunction("fear");
    });

    it("happiness - test seed data", async function () {
        return testSeedFunction("happiness");
    });

    it("neutral - test seed data", async function () {
        return testSeedFunction("neutral");
    });

    it("sadness - test seed data", async function () {
        return testSeedFunction("sadness");
    });

    it("surprise - test seed data", async function () {
        return testSeedFunction("surprise");
    });

    it("add all the tracks into hashmap", async function () {
        return spotify.addAllTracksToHashMap()
            .then((res) => {
                console.log("# RECENT SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            });
    });

    it("get user's tracks from all playlists", async function() {
        return spotify.addUserPlaylistsTracks()
            .then((res) => {
                console.log("# PLAYLIST SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            })
    })

    it("get user info", async function() {
        return spotify.getUserInfo()
            .then((res) => {
                chai.expect(res).hasOwnProperty("display_name");
                chai.expect(res).hasOwnProperty("email");
                chai.expect(res).hasOwnProperty("images");
                chai.expect(res).hasOwnProperty("external_urls");
                console.log(res);
            })
            .catch((err) => {
                console.log("ERROR");
                chai.expect.fail();
            })
    })

    it("test createNewPlaylist - WILL CREATE PLAYLIST", async function() {
        spotify.mood = "happiness";
        try {
            let result = await spotify.createNewPlaylist();
            chai.assert.isNotNull(result);
            chai.assert.isNotNull(result.body);
            chai.expect(result.body.name).to.be.equal("Flow Playlist: " + spotify.mood);
            chai.assert.isFalse(result.body.public);
        }
        catch(e) {
            chai.expect.fail();
        }
    })

    it("test getNewPlaylist expect success - WILL CREATE PLAYLIST", async function() {
        let trackURIs = ["spotify:track:1ue7zm5TVVvmoQV8lK6K2H","spotify:track:07ARBxsDbIdAxLwuRCkGJ4","spotify:track:2KoHxhRyWxJzA0VafWd5Nk","spotify:track:7i2DJ88J7jQ8K7zqFX2fW8","spotify:track:3R6dPfF2yBO8mHySW1XDAa","spotify:track:2b8fOow8UzyDFAE27YhOZM","spotify:track:7e6FvCvngX5job1PUYIIIL","spotify:track:2ZTYlnhhV1UAReg7wIGolx","spotify:track:6vzLbfskWigBsCzNdB0kfE","spotify:track:2ktxr00GpTtbMNeBjNeY8D","spotify:track:5HM5Km4Ydmcj9okVC6AxOu","spotify:track:6lruHh1jF7ezgbLv72xYmf","spotify:track:6yHkPtl6UQ7RjtJLBPzbJw","spotify:track:4umIPjkehX1r7uhmGvXiSV","spotify:track:7k6tAZp4m93oswrPqSfBbc","spotify:track:4JuZQeSRYJfLCqBgBIxxrR","spotify:track:0nhVrTiCGiGRCoZOJiWzm1","spotify:track:4TnjEaWOeW0eKTKIEvJyCa","spotify:track:3npvm6Dy5eSZioXJ2KF4xY","spotify:track:2nC3QhMI9reBIOWutbU3Tj","spotify:track:2tnVG71enUj33Ic2nFN6kZ","spotify:track:6Yx181fZzA0YE2EkUsYruq"];
        spotify.mood = "happiness";
        try {
            let url = await spotify.getNewPlaylist(trackURIs);
            chai.assert.isNotNull(url);
            chai.expect(typeof(url)).to.be.equal("string");
        }
        catch(e)
        {
            chai.assert.fail();
        }
    })

    it("test getNewPlaylist null input", async function() {
        try {
            let url = await spotify.getNewPlaylist(null);
            chai.expect.fail();
        }
        catch(e) {
            console.log();
        }
    })

    it("test getNewPlaylist incorrect input type", async function() {
        try {
            let url = await spotify.getNewPlaylist("testString");
            chai.expect.fail();
        }
        catch(e) {}
    })

    it("test getNewPlaylist empty array", async function() {
        try {
            let url = await spotify.getNewPlaylist([]);
            chai.expect.fail();
        }
        catch(e) {}
    })


});
