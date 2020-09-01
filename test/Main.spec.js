var chai = require("chai");
const {Main} = require("../controllers/Main");
var sampleDataURL = require("./sampleDataURL");

let main;
describe("unit test for Main", function () {
    before(function () {
        main = new Main("myDATAURL"); //TODO: fix
        require('dotenv').config();
    });

    it("testing Main function", async function(){
        let resp = await main.getRelevantSongsTestingPurposes();
    });

    it("testing Main function with data URL", async function(){
        main.dataURL = sampleDataURL.dataURL2;
        let resp = await main.getRelevantSongs();
    });

    it("test static field", function(){
        chai.assert(Main.tracks === undefined);
        Main.tracks = "x";
        chai.assert(Main.tracks === "x");
    })

    it("test createMoodPlaylist with null input", function() {
        try
        {
            main.createMoodPlaylist(null)
            chai.assert.fail("expected error to be thrown")
        } catch (e) { }
    })

    it("test createMoodPlaylist with undefined input", function() {
        try
        {
            main.createMoodPlaylist(undefined)
            chai.assert.fail("expected error to be thrown")
        } catch (e) { }
    })

    it("test createMoodPlaylist with incorrect input type", function() {
        try
        {
            main.createMoodPlaylist("testString")
            chai.assert.fail("expected error to be thrown")
        } catch (e) { }
    })

    it("test createMoodPlaylist with empty array", function() {
        try
        {
            main.createMoodPlaylist([])
            chai.assert.fail("expected error to be thrown")
        }
        catch (e) { }
    })

});
