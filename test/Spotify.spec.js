var chai = require("chai");
const request = require('request');
const {Spotify} = require("../controllers/Spotify");

var spotify;
describe("unit test for Spotify", function () {
    before(function () {
        spotify = new Spotify();
        require('dotenv').config();
    });

    it("test Sample Function", function () {
        return spotify.sampleFunction().then((res) => {
            console.log(JSON.stringify(res.body));
        }).catch((err)=> {
            console.log(err);
            chai.expect.fail();
        });
    });

    it("get Recent Songs", async function () {
        let json = await spotify.addRecentlyPlayedTracks();
        console.log(json);
    });

    it("get Top Tracks", async function() {
        let json = await spotify.addTopTracks();
        console.log(json);

    });

    it("get Top Artists", async function() {
        let json = await spotify.addTopArtistsTracks();
        console.log(json);

    });

    it("add Saved tracks", async function() {
        let json = await spotify.addSavedTracks();
        console.log(json);

    });

    it("get Sample Data For AI", async function() {
        let json = await spotify.getSampleDataToWorkWith();
        console.log(json);

    });


});
