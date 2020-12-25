const chai = require("chai");
const {SpotifyService} = require("../../src/service/SpotifyService");
const SpotifyWebApi = require("spotify-web-api-node");
const Err = require("../../src/constant/Error");
const {RefreshCredentialService} = require("../../src/service/RefreshCredentialService");

let spotifyService;
let spotifyApi;

describe("unit test for SpotifyService", function () {
    before(async function () {
        require("dotenv").config();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
            refreshToken: process.env.REFRESH_TOKEN,
        });
        const refreshCredentialService = new RefreshCredentialService(spotifyApi);
        await refreshCredentialService.tryRefreshCredential();
    });

    beforeEach(() => {
        spotifyService = new SpotifyService(spotifyApi);
    });

    /* eslint-disable no-unused-vars*/
    function printOutSongNames() {
        for (const track of spotifyService.trackHashMap.values()) {
            console.log(track.name);
        }
    }

    it("test add unsuccessful tracks to hashmap", function () {
        spotifyService.addTracksToHashMap();
        spotifyService.addTracksToHashMap(null);
        spotifyService.addTracksToHashMap([]);
        spotifyService.addTracksToHashMap("Invalid Input");
        chai.expect(spotifyService.trackHashMap.size).to.be.equal(0);
    });

    it("test add successful tracks to hashmap", function () {
        const testData = [{id: 123}, {id: 456}];
        spotifyService.addTracksToHashMap(testData);
        chai.expect(spotifyService.trackHashMap.size).to.be.equal(2);
    });

    it("get Recent Songs", function () {
        return spotifyService.addRecentlyPlayedTracks()
            .then((res) => {
                console.log("# RECENT SONGS ADDED: " + spotifyService.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("get Top Tracks", function () {
        return spotifyService.addTopTracks()
            .then((res) => {
                console.log("# TOP SONGS ADDED: " + spotifyService.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });

    });

    it("get Top Artists", function () {
        return spotifyService.addTopArtistsTracks()
            .then((res) => {
                console.log("# TOP ARTIST SONGS ADDED: " + spotifyService.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });

    });

    it("add Saved tracks", function () {
        return spotifyService.addSavedTracks()
            .then((res) => {
                console.log("# SAVED SONGS ADDED: " + spotifyService.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });

    });

    it("get all sample data audio features", function () {
        return spotifyService.getAllAudioFeatures()
            .then((res) => {
                // console.log(res);
                chai.expect(Object.keys(res).length).to.be.equal(spotifyService.trackHashMap.size);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });

    });

    // SEED TESTS

    function testSeedFunction(mood) {
        spotifyService.mood = mood;
        return spotifyService.addSeedTracks()
            .then((res) => {
                chai.assert(res);
                console.log("# RECENT SONGS ADDED: " + spotifyService.trackHashMap.size);
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
        return spotifyService.addAllTracksToHashMap()
            .then((res) => {
                console.log("# RECENT SONGS ADDED: " + spotifyService.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("get user's tracks from all playlists", function () {
        return spotifyService.addUserPlaylistsTracks()
            .then((res) => {
                console.log("# PLAYLIST SONGS ADDED: " + spotifyService.trackHashMap.size);
                chai.assert(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("get user info", function () {
        return spotifyService.getUserInfo()
            .then((res) => {
                chai.expect(res.display_name).to.not.be.undefined;
                chai.expect(res.email).to.not.be.undefined;
                chai.expect(res.images).to.not.be.undefined;
                chai.expect(res.external_urls).to.not.be.undefined;
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    xit("test createNewPlaylist - WILL CREATE PLAYLIST", function () {
        spotifyService.mood = "happiness";
        return spotifyService.createNewPlaylist()
            .then((result) => {
                chai.assert.isNotNull(result);
                chai.assert.isNotNull(result.body);
                chai.expect(result.body.name).to.be.equal("Flow Playlist: " + spotifyService.mood);
                chai.assert.isFalse(result.body.public);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("test createNewPlaylist - mood is not set expect fail", function () {
        spotifyService.mood = null;
        return spotifyService.createNewPlaylist()
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidResponseError);
            });
    });

    xit("test getNewPlaylist expect success - WILL CREATE PLAYLIST", function () {
        const trackURIs = ["spotify:track:1ue7zm5TVVvmoQV8lK6K2H", "spotify:track:07ARBxsDbIdAxLwuRCkGJ4", "spotify:track:2KoHxhRyWxJzA0VafWd5Nk", "spotify:track:7i2DJ88J7jQ8K7zqFX2fW8", "spotify:track:3R6dPfF2yBO8mHySW1XDAa", "spotify:track:2b8fOow8UzyDFAE27YhOZM", "spotify:track:7e6FvCvngX5job1PUYIIIL", "spotify:track:2ZTYlnhhV1UAReg7wIGolx", "spotify:track:6vzLbfskWigBsCzNdB0kfE", "spotify:track:2ktxr00GpTtbMNeBjNeY8D", "spotify:track:5HM5Km4Ydmcj9okVC6AxOu", "spotify:track:6lruHh1jF7ezgbLv72xYmf", "spotify:track:6yHkPtl6UQ7RjtJLBPzbJw", "spotify:track:4umIPjkehX1r7uhmGvXiSV", "spotify:track:7k6tAZp4m93oswrPqSfBbc", "spotify:track:4JuZQeSRYJfLCqBgBIxxrR", "spotify:track:0nhVrTiCGiGRCoZOJiWzm1", "spotify:track:4TnjEaWOeW0eKTKIEvJyCa", "spotify:track:3npvm6Dy5eSZioXJ2KF4xY", "spotify:track:2nC3QhMI9reBIOWutbU3Tj", "spotify:track:2tnVG71enUj33Ic2nFN6kZ", "spotify:track:6Yx181fZzA0YE2EkUsYruq"];
        spotifyService.mood = "happiness";

        return spotifyService.getNewPlaylist(trackURIs)
            .then((url) => {
                chai.assert.isNotNull(url);
                chai.expect(typeof url).to.be.equal("string");
            }).catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("test getNewPlaylist null input", function () {
        return spotifyService.getNewPlaylist(null)
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getNewPlaylist incorrect input type", function () {
        return spotifyService.getNewPlaylist("testString")
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getNewPlaylist empty array", function () {
        return spotifyService.getNewPlaylist([])
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });
});
