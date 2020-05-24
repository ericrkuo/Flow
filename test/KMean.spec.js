var chai = require("chai");
const request = require('request');
const {songs} = require("./sampleSpotifyAudioFeatures");
const {KMean} = require("../controllers/KMean");

var spotify;
describe("unit test for KMeans", function () {
    let kMean;
    before(function () {
        kMean = new KMean();
    });

    it("sample",function(){
        let data = songs;
        let maxTempo =0;
        for(let feature of Object.values(data)) {
            maxTempo = Math.max(feature["tempo"], maxTempo)
        }
        console.log(maxTempo);
    });

    it("test K Means", function(){
        let clusters = kMean.kMean(songs, 8);
        console.log();
    })
});