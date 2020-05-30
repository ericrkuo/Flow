var chai = require("chai");
const request = require('request');
const {Spotify} = require("../controllers/Spotify");

var spotify;
describe("unit test for Spotify", function () {
    before(function () {
        spotify = new Spotify();
        require('dotenv').config();
    });

    beforeEach(()=> {
        spotify = new Spotify();
    });

    function printOutSongNames() {
        for (let track of spotify.trackHashMap.values()) {
            console.log(track.name);
        }
    }
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

    it("get seed data", async function () {
        spotify.mood = "sadness";
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


});
