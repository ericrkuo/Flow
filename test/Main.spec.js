var chai = require("chai");
const {Main} = require("../controllers/Main");
var sampleDataURL = require("./sampleDataURL");
const Error = require("../controllers/Error");

let main;
describe("unit test for Main", function () {
    before(function () {
        require('dotenv').config();
        main = new Main();
        main.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
    });

    it("testing Main function", async function(){
        main.dataURL = "TestDataURL"
        let resp = await main.getRelevantSongsTestingPurposes();
    });

    it("testing Main function without valid dataURL set", async function(){
        main.dataURL = null;
        try {
            await main.getRelevantSongs();
        } catch(err){
            console.log(err);
            chai.expect(err).to.be.instanceOf(Error.InvalidDataURLError);
        }

    });

    it("testing Main function with data URL", async function(){
        main.dataURL = sampleDataURL.dataURL1;
        let resp = await main.getRelevantSongs();
    });

    it("test createMoodPlaylist with null input", function() {
        try
        {
            main.createMoodPlaylist(null)
            chai.assert.fail("expected error to be thrown")
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Error.InvalidInputError);
        }
    })

    it("test createMoodPlaylist with undefined input", function() {
        try
        {
            main.createMoodPlaylist(undefined)
            chai.assert.fail("expected error to be thrown")
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Error.InvalidInputError);
        }
    })

    it("test createMoodPlaylist with incorrect input type", function() {
        try
        {
            main.createMoodPlaylist("testString")
            chai.assert.fail("expected error to be thrown")
        } catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Error.InvalidInputError);
        }
    })

    it("test createMoodPlaylist with empty array", function() {
        try
        {
            main.createMoodPlaylist([])
            chai.assert.fail("expected error to be thrown")
        }
        catch (e) {
            console.log(e);
            chai.expect(e).to.be.instanceOf(Error.InvalidInputError);
        }
    })

});
