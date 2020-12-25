const chai = require("chai");
const Err = require("../../src/constant/Error");
const {songs, songsClearCluster, songsLargeClearCluster} = require("../resources/sampleSpotifyAudioFeatures");
const {KMean} = require("../../src/clustering/KMean");

describe("unit test for KMeans", function () {
    let kMean;
    before(function () {
        kMean = new KMean();
    });

    it("sample", function () {
        const data = songs;
        let maxTempo = 0;
        for (const feature of Object.values(data)) {
            maxTempo = Math.max(feature["tempo"], maxTempo);
        }
        console.log(maxTempo);
    });

    it("test K Means and single silhouette", function () {
        try {
            const k = 8;
            const clusters = kMean.kMean(songs, k);
            chai.expect(clusters.length).to.be.equal(k);
            const silhouetteValue = kMean.computeSilhouetteValue(clusters);
            console.log("SILHOUETTE VALUE - " + silhouetteValue);
            chai.assert(silhouetteValue <= 1 && silhouetteValue >= -1);
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });


    it("find optimum silhouette value", function () {
        try {
            const kStart = 4;
            const kEnd = 20;
            const arr = new Map();
            for (let k = kStart; k <= kEnd; k++) {
                const clusters = kMean.kMean(songs, k);
                chai.expect(clusters.length).to.be.equal(k);
                const silhouetteValue = kMean.computeSilhouetteValue(clusters);
                chai.assert(silhouetteValue <= 1 && silhouetteValue >= -1);
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
            const kStart = 2;
            const kEnd = 4;
            const arr = new Map();
            for (let k = kStart; k <= kEnd; k++) {
                const clusters = kMean.kMean(songsClearCluster, k);
                chai.expect(clusters.length).to.be.equal(k);
                const silhouetteValue = kMean.computeSilhouetteValue(clusters);
                chai.assert(silhouetteValue <= 1 && silhouetteValue >= -1);
                arr.set(k + " = " + silhouetteValue, clusters);
            }
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });

    it("find optimum silhouette value with larger clear clustered data", function () {
        try {
            const kStart = 2;
            const kEnd = 8;
            const arr = new Map();
            for (let k = kStart; k <= kEnd; k++) {
                const clusters = kMean.kMean(songsLargeClearCluster, k);
                chai.expect(clusters.length).to.be.equal(k);
                const silhouetteValue = kMean.computeSilhouetteValue(clusters);
                chai.assert(silhouetteValue <= 1 && silhouetteValue >= -1);
                arr.set(k + " = " + silhouetteValue, clusters);
            }
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });

    it("test getOptimalKClusters", function () {
        try {
            const [bestK, clusters, map] = kMean.getOptimalKClusters(songsLargeClearCluster);
            chai.expect(clusters.length).to.equal(bestK);
            chai.expect(map.size).to.equal(10);
        } catch (err) {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        }
    });

});