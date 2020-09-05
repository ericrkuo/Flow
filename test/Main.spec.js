var chai = require("chai");
const {Main} = require("../controllers/Main");
let sampleDataURL = require("./sampleDataURL");
const Err = require("../controllers/Error");

let main;
describe("unit test for Main", function () {
    before(function () {
        require('dotenv').config();
        main = new Main();
        main.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
    });

    it("test getRelevantSongsTestingPurposes", function () {
        main.dataURL = "TestDataURL";
        return main.getRelevantSongsTestingPurposes()
            .then((resp) => {
                chai.expect(Object.keys(resp).length).to.be.equal(30);
                chai.assert(main.result && main.result.tracks && main.result.userInfo && main.result.mood)
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail();
            })
    });

    it("test getRelevantSongs - without valid dataURL set", function () {
        main.dataURL = null;
        return main.getRelevantSongs()
            .then(() => {
                chai.expect.fail();
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidDataURLError);
            })
    });

    it("test getRelevantSongs - with data URL", function () {
        main.dataURL = sampleDataURL.dataURL1;
        return main.getRelevantSongs()
            .then((resp) => {
                chai.expect(Object.keys(resp).length).to.be.equal(30);
                chai.assert(main.result && main.result.tracks && main.result.userInfo && main.result.mood)
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail();
            })
    });

    it("test createMoodPlaylist with null input", function () {
        return main.createMoodPlaylist(null)
            .then(() => {
                chai.assert.fail("expected error to be thrown")
            })
            .catch((e) => {
                console.log(e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    })

    it("test createMoodPlaylist with undefined input", function () {
        return main.createMoodPlaylist(undefined)
            .then(() => {
                chai.assert.fail("expected error to be thrown")
            })
            .catch((e) => {
                console.log(e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    })

    it("test createMoodPlaylist with incorrect input type", function () {
        return main.createMoodPlaylist("testString")
            .then(() => {
                chai.assert.fail("expected error to be thrown")
            })
            .catch((e) => {
                console.log(e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    })

    it("test createMoodPlaylist with empty array", function () {
        return main.createMoodPlaylist([])
            .then(() => {
                chai.assert.fail("expected error to be thrown")
            })
            .catch((e) => {
                console.log(e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    })

});
