var chai = require("chai");
const request = require('request');
const {songs, songsClearCluster, songsLargeClearCluster} = require("./sampleSpotifyAudioFeatures");
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

    it("test K Means and single silhouette", function(){
        let k = 8;
        let clusters = kMean.kMean(songs, k);
        chai.expect(clusters.length).to.be.equal(k);
        let silhouetteValue = kMean.computeSilhouetteValue(clusters);
        console.log("SILHOUETTE VALUE - " + silhouetteValue);
        chai.assert((silhouetteValue<=1) && (silhouetteValue>=-1));
    });


    it("find optimum silhouette value", function(){
        let kStart = 4;
        let kEnd = 20;
        let arr = new Map();
        for (let k = kStart; k<=kEnd; k++){
            let clusters = kMean.kMean(songs, k);
            chai.expect(clusters.length).to.be.equal(k);
            let silhouetteValue = kMean.computeSilhouetteValue(clusters);
            chai.assert((silhouetteValue<=1) && (silhouetteValue>=-1));
            arr.set(k + " = " + silhouetteValue, clusters);
        }
    });

    it("find optimum silhouette value with clear clustered data", function(){
        let kStart = 2;
        let kEnd = 4;
        let arr = new Map();
        for (let k = kStart; k<=kEnd; k++){
            let clusters = kMean.kMean(songsClearCluster, k);
            chai.expect(clusters.length).to.be.equal(k);
            let silhouetteValue = kMean.computeSilhouetteValue(clusters);
            chai.assert((silhouetteValue<=1) && (silhouetteValue>=-1));
            arr.set(k + " = " + silhouetteValue, clusters);
        }
    });

    it("find optimum silhouette value with larger clear clustered data", function(){
        let kStart = 2;
        let kEnd = 8;
        let arr = new Map();
        for (let k = kStart; k<=kEnd; k++){
            let x = songsLargeClearCluster;
            let clusters = kMean.kMean(songsLargeClearCluster, k);
            chai.expect(clusters.length).to.be.equal(k);
            let silhouetteValue = kMean.computeSilhouetteValue(clusters);
            chai.assert((silhouetteValue<=1) && (silhouetteValue>=-1));
            arr.set(k + " = " + silhouetteValue, clusters);
        }
    });

    it("test getOptimalKClusters", function(){
        let clusters = kMean.getOptimalKClusters(songsLargeClearCluster);
    });

});