var chai = require("chai");
const {Spotify} = require("../controllers/Spotify");
const SpotifyWebApi = require('spotify-web-api-node');
const Err = require("../controllers/Error");
const {RefreshCredential} = require("../controllers/RefreshCredential");

let spotify;
let spotifyApi;

describe("unit test for Spotify", function () {
    before(async function () {
        require('dotenv').config();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
            refreshToken: process.env.REFRESH_TOKEN,
        });
        let refreshCredential = new RefreshCredential(spotifyApi);
        await refreshCredential.tryRefreshCredential()
    });

    beforeEach(() => {
        spotify = new Spotify(spotifyApi);
    });

    function printOutSongNames() {
        for (let track of spotify.trackHashMap.values()) {
            console.log(track.name);
        }
    }

    it("test add unsuccessful tracks to hashmap", function () {
        spotify.addTracksToHashMap();
        spotify.addTracksToHashMap(null);
        spotify.addTracksToHashMap([]);
        spotify.addTracksToHashMap("Invalid Input");
        chai.expect(spotify.trackHashMap.size).to.be.equal(0);
    });

    it("test add successful tracks to hashmap", function () {
        let testData = [{id: 123}, {id: 456}];
        spotify.addTracksToHashMap(testData);
        chai.expect(spotify.trackHashMap.size).to.be.equal(2);
    });

    it("get Recent Songs", function () {
        return spotify.addRecentlyPlayedTracks()
            .then((res) => {
                console.log("# RECENT SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("get Top Tracks", function () {
        return spotify.addTopTracks()
            .then((res) => {
                console.log("# TOP SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });

    });

    it("get Top Artists", function () {
        return spotify.addTopArtistsTracks()
            .then((res) => {
                console.log("# TOP ARTIST SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });

    });

    it("add Saved tracks", function () {
        return spotify.addSavedTracks()
            .then((res) => {
                console.log("# SAVED SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });

    });

    it("get all sample data audio features", function () {
        return spotify.getAllAudioFeatures()
            .then((res) => {
                // console.log(res);
                chai.expect(Object.keys(res).length).to.be.equal(spotify.trackHashMap.size);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });

    });

    // SEED TESTS

    function testSeedFunction(mood) {
        spotify.mood = mood;
        return spotify.addSeedTracks()
            .then((res) => {
                chai.assert(res);
                console.log("# RECENT SONGS ADDED: " + spotify.trackHashMap.size);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    }

    it("anger - test seed data", function () {
        return testSeedFunction("anger");
    });

    it("contempt - test seed data", function () {
        return testSeedFunction("contempt");
    });

    it("disgust - test seed data", function () {
        return testSeedFunction("disgust");
    });

    it("fear - test seed data", function () {
        return testSeedFunction("fear");
    });

    it("happiness - test seed data", function () {
        return testSeedFunction("happiness");
    });

    it("neutral - test seed data", function () {
        return testSeedFunction("neutral");
    });

    it("sadness - test seed data", function () {
        return testSeedFunction("sadness");
    });

    it("surprise - test seed data", function () {
        return testSeedFunction("surprise");
    });

    it("add all the tracks into hashmap", function () {
        return spotify.addAllTracksToHashMap()
            .then((res) => {
                console.log("# RECENT SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("get user's tracks from all playlists", function () {
        return spotify.addUserPlaylistsTracks()
            .then((res) => {
                console.log("# PLAYLIST SONGS ADDED: " + spotify.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            })
    })

    it("get user info", function () {
        return spotify.getUserInfo()
            .then((res) => {
                chai.expect(res).hasOwnProperty("display_name");
                chai.expect(res).hasOwnProperty("email");
                chai.expect(res).hasOwnProperty("images");
                chai.expect(res).hasOwnProperty("external_urls");
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            })
    })

    xit("test createNewPlaylist - WILL CREATE PLAYLIST", function () {
        spotify.mood = "happiness";
        return spotify.createNewPlaylist()
            .then((result) => {
                chai.assert.isNotNull(result);
                chai.assert.isNotNull(result.body);
                chai.expect(result.body.name).to.be.equal("Flow Playlist: " + spotify.mood);
                chai.assert.isFalse(result.body.public);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    })

    it("test createNewPlaylist - mood is not set expect fail", function () {
        spotify.mood = null;
        return spotify.createNewPlaylist()
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidResponseError);
            });
    })

    xit("test getNewPlaylist expect success - WILL CREATE PLAYLIST", function () {
        let trackURIs = ["spotify:track:1ue7zm5TVVvmoQV8lK6K2H", "spotify:track:07ARBxsDbIdAxLwuRCkGJ4", "spotify:track:2KoHxhRyWxJzA0VafWd5Nk", "spotify:track:7i2DJ88J7jQ8K7zqFX2fW8", "spotify:track:3R6dPfF2yBO8mHySW1XDAa", "spotify:track:2b8fOow8UzyDFAE27YhOZM", "spotify:track:7e6FvCvngX5job1PUYIIIL", "spotify:track:2ZTYlnhhV1UAReg7wIGolx", "spotify:track:6vzLbfskWigBsCzNdB0kfE", "spotify:track:2ktxr00GpTtbMNeBjNeY8D", "spotify:track:5HM5Km4Ydmcj9okVC6AxOu", "spotify:track:6lruHh1jF7ezgbLv72xYmf", "spotify:track:6yHkPtl6UQ7RjtJLBPzbJw", "spotify:track:4umIPjkehX1r7uhmGvXiSV", "spotify:track:7k6tAZp4m93oswrPqSfBbc", "spotify:track:4JuZQeSRYJfLCqBgBIxxrR", "spotify:track:0nhVrTiCGiGRCoZOJiWzm1", "spotify:track:4TnjEaWOeW0eKTKIEvJyCa", "spotify:track:3npvm6Dy5eSZioXJ2KF4xY", "spotify:track:2nC3QhMI9reBIOWutbU3Tj", "spotify:track:2tnVG71enUj33Ic2nFN6kZ", "spotify:track:6Yx181fZzA0YE2EkUsYruq"];
        spotify.mood = "happiness";

        return spotify.getNewPlaylist(trackURIs)
            .then((url) => {
                chai.assert.isNotNull(url);
                chai.expect(typeof (url)).to.be.equal("string");
            }).catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    })

    it("test getNewPlaylist null input", function () {
        return spotify.getNewPlaylist(null)
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            })
    })

    it("test getNewPlaylist incorrect input type", function () {
        return spotify.getNewPlaylist("testString")
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            })
    })

    it("test getNewPlaylist empty array", function () {
        return spotify.getNewPlaylist([])
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            })
    })
});
