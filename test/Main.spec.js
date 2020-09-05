var chai = require("chai");
const {Main} = require("../controllers/Main");
var sampleDataURL = require("./sampleDataURL");
const Err = require("../controllers/Error");

let main;
describe("unit test for Main", function () {
    before(function () {
        require('dotenv').config();
        main = new Main();
        main.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
    });

    it("test getRelevantSongsTestingPurposes", async function () {
        try {
            main.dataURL = "TestDataURL"
            let resp = await main.getRelevantSongsTestingPurposes();
            chai.expect(Object.keys(resp).length).to.be.equal(30);
            chai.assert(main.result && main.result.tracks && main.result.userInfo && main.result.mood)
        } catch (err) {
            console.log(err);
            chai.expect.fail();
        }
    });

    it("test getRelevantSongs - without valid dataURL set", async function () {
        main.dataURL = null;
        try {
            await main.getRelevantSongs();
        } catch (err) {
            console.log(err);
            chai.expect(err).to.be.instanceOf(Err.InvalidDataURLError);
        }

    });

    it("test getRelevantSongs - with data URL", async function () {
        try {
            main.dataURL = sampleDataURL.dataURL1;
            let resp = await main.getRelevantSongs();
            chai.expect(Object.keys(resp).length).to.be.equal(30);
            chai.assert(main.result && main.result.tracks && main.result.userInfo && main.result.mood)
        } catch (err) {
            console.log(e);
            chai.expect.fail();
        }
    });

    it("test createMoodPlaylist with null input", function () {
        try {
            main.createMoodPlaylist(null)
            chai.assert.fail("expected error to be thrown")
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    })

    it("test createMoodPlaylist with undefined input", function () {
        try {
            main.createMoodPlaylist(undefined)
            chai.assert.fail("expected error to be thrown")
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    })

    it("test createMoodPlaylist with incorrect input type", function () {
        try {
            main.createMoodPlaylist("testString")
            chai.assert.fail("expected error to be thrown")
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    })

    it("test createMoodPlaylist with empty array", function () {
        try {
            main.createMoodPlaylist([])
            chai.assert.fail("expected error to be thrown")
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
        }
    })

});
