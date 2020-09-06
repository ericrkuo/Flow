var chai = require("chai");
const Err = require("../controllers/Error");
const {songs, songsClearCluster, songsLargeClearCluster} = require("./sampleSpotifyAudioFeatures");
const {KMean} = require("../controllers/KMean");

describe("unit test for KMeans", function () {
    let kMean;
    before(function () {
        kMean = new KMean();
    });

    it("sample", function () {
        let data = songs;
        let maxTempo = 0;
        for (let feature of Object.values(data)) {
            maxTempo = Math.max(feature["tempo"], maxTempo)
        }
        console.log(maxTempo);
    });

    it("test K Means and single silhouette", function () {
        try {
            let k = 8;
            let clusters = kMean.kMean(songs, k);
            chai.expect(clusters.length).to.be.equal(k);
            let silhouetteValue = kMean.computeSilhouetteValue(clusters);
            console.log("SILHOUETTE VALUE - " + silhouetteValue);
            chai.assert((silhouetteValue <= 1) && (silhouetteValue >= -1));
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });


    it("find optimum silhouette value", function () {
        try {
            let kStart = 4;
            let kEnd = 20;
            let arr = new Map();
            for (let k = kStart; k <= kEnd; k++) {
                let clusters = kMean.kMean(songs, k);
                chai.expect(clusters.length).to.be.equal(k);
                let silhouetteValue = kMean.computeSilhouetteValue(clusters);
                chai.assert((silhouetteValue <= 1) && (silhouetteValue >= -1));
                arr.set(k + " = " + silhouetteValue, clusters);
            }
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });

    it("test kMean, clusters is null", function () {
        try {
            kMean.data = [];
            kMean.k = 2;
            kMean.features = ["danceability", "energy", "acousticness", "tempo", "valence"];
            kMean.iterate();
        } catch (err) {
            console.log(err);
            chai.expect(err).to.be.instanceOf(Err.KMeanClusterError);
        }
    });

    it("test kMean, exceed MAX_ITERATIONS", function () {
        try {
            kMean.data = [];
            kMean.k = 2;
            kMean.features = ["danceability", "energy", "acousticness", "tempo", "valence"];
            kMean.MAX_ITERATIONS = 30;
            kMean.iterations = kMean.MAX_ITERATIONS + 1;
            kMean.iterate();
        } catch (err) {
            console.log(err);
            chai.expect(err).to.be.instanceOf(Err.KMeanIterationError);
        }
    });

    it("find optimum silhouette value with clear clustered data", function () {
        try {
            let kStart = 2;
            let kEnd = 4;
            let arr = new Map();
            for (let k = kStart; k <= kEnd; k++) {
                let clusters = kMean.kMean(songsClearCluster, k);
                chai.expect(clusters.length).to.be.equal(k);
                let silhouetteValue = kMean.computeSilhouetteValue(clusters);
                chai.assert((silhouetteValue <= 1) && (silhouetteValue >= -1));
                arr.set(k + " = " + silhouetteValue, clusters);
            }
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });

    it("find optimum silhouette value with larger clear clustered data", function () {
        try {
            let kStart = 2;
            let kEnd = 8;
            let arr = new Map();
            for (let k = kStart; k <= kEnd; k++) {
                let x = songsLargeClearCluster;
                let clusters = kMean.kMean(songsLargeClearCluster, k);
                chai.expect(clusters.length).to.be.equal(k);
                let silhouetteValue = kMean.computeSilhouetteValue(clusters);
                chai.assert((silhouetteValue <= 1) && (silhouetteValue >= -1));
                arr.set(k + " = " + silhouetteValue, clusters);
            }
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });

    it("test getOptimalKClusters", function () {
        try {
            let [bestK, clusters, map] = kMean.getOptimalKClusters(songsLargeClearCluster);
            console.log();
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });

});