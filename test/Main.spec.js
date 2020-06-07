var chai = require("chai");
const request = require('request');
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
        chai.assert(Main.tracks === null);
        Main.tracks = "x";
        chai.assert(Main.tracks === "x");
    })

});
