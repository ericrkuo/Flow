const chai = require("chai");
const {Main} = require("../src/Main");
const sampleDataURL = require("./resources/sampleDataURL");
const Err = require("../src/constant/Error");
const {RefreshCredentialService} = require("../src/service/RefreshCredentialService");

let main;
describe("unit test for Main", function () {
    before(async function () {
        require("dotenv").config();
        main = new Main();
        main.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        const refreshCredentialService = new RefreshCredentialService(main.spotifyApi);
        await refreshCredentialService.tryRefreshCredential();
    });

    it("test getRelevantSongsTestingPurposes", function () {
        main.dataURL = "TestDataURL";
        return main.getRelevantSongsTestingPurposes()
            .then((resp) => {
                assertResponseFromMain(resp);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("test getRelevantSongs - without valid dataURL set", function () {
        main.dataURL = null;
        return main.getRelevantSongs()
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidDataURLError);
            });
    });

    it("test getRelevantSongs - with data URL", function () {
        main.dataURL = sampleDataURL.dataURL1;
        return main.getRelevantSongs()
            .then((resp) => {
                assertResponseFromMain(resp);
            })
            .catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("test createMoodPlaylist with null input", function () {
        return main.createMoodPlaylist(null)
            .then(() => {
                chai.assert.fail("expected error to be thrown");
            })
            .catch((e) => {
                console.log(e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test createMoodPlaylist with undefined input", function () {
        return main.createMoodPlaylist(undefined)
            .then(() => {
                chai.assert.fail("expected error to be thrown");
            })
            .catch((e) => {
                console.log(e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test createMoodPlaylist with incorrect input type", function () {
        return main.createMoodPlaylist("testString")
            .then(() => {
                chai.assert.fail("expected error to be thrown");
            })
            .catch((e) => {
                console.log(e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test createMoodPlaylist with empty array", function () {
        return main.createMoodPlaylist([])
            .then(() => {
                chai.assert.fail("expected error to be thrown");
            })
            .catch((e) => {
                console.log(e);
                chai.expect(e).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    function assertResponseFromMain(resp) {
        // check first level properties
        chai.expect(resp).to.have.own.property("tracks");
        chai.expect(resp).to.have.own.property("userInfo");
        chai.expect(resp).to.have.own.property("mood");

        // check tracks
        chai.expect(Object.keys(resp.tracks).length).to.be.equal(30);
        for (const track of Object.values(resp.tracks)) {
            chai.expect(track).to.have.own.property("track");
            chai.expect(track).to.have.own.property("audioFeatures");
        }

        // check userInfo
        chai.expect(resp.userInfo).to.have.own.property("display_name");
        chai.expect(resp.userInfo).to.have.own.property("email");
        chai.expect(resp.userInfo).to.have.own.property("external_urls");
        chai.expect(resp.userInfo).to.have.own.property("images");
        chai.expect(resp.userInfo).to.have.own.property("id");

        // check mood
        chai.expect(resp.mood).to.have.own.property("dominantMood");
        chai.expect(resp.mood).to.have.own.property("emotions");
    }
});
