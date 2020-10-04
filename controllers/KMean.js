const Err = require("./Error");

class KMean {

    /*
    * Summary.kMean algorithm
    *
    * High Level Steps.
    * 1. choose k random centroids
    * 2. move each data vector to closest centroid, so create the clusters
    * 3. recalculate the means of the centroids
    * 4. if centroids shifted, redo steps, otherwise return clusters
    *
    * Description.
    * * features = {f1,f2,f3,...}
    * * track = [id, {f1,f2,f3,f4,...}]
    * * data: [track1, track2, track3, ...] - array of tracks where each track = [trackID, audioFeatures]
    * * centroids: [0: features0, 1: features1, ..., k: featuresk] - array of k audio features
    * * clusters: [0: [tracks], 1: [tracks], 2: [tracks], ..., k: [tracks]] - array of k tracks where each track = [trackID, audioFeatures]
    * * vecArray: [0: features0, 1: features1, ..., k: featuresk] - array of k audioFeatures, vecArray[i] is average of all audioFeatures for this.clusters[i]
    *
    * */
    kMean(data, k) {
        this.data = Object.entries(data); // [ [id1, {f1, f2, ...}], [id2, {f1, f2, ...}], ...]
        this.k = k;
        this.meanValueLeniency = 0.001;
        this.centroids = new Array(k);
        this.clusters = new Array(k);

        // this.features = ["danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"];
        // this.features = ["danceability", "energy", "acousticness", "liveness", "valence"];             //4 = 0.4329
        this.features = ["danceability", "energy", "acousticness", "tempo", "valence"];                //4 = 0.44687119025731736 --good 1/2
        // this.features = ["danceability", "energy", "acousticness", "tempo", "valence", "loudness"];    //4 = 0.43940590935718105
        // this.features = ["danceability", "energy", "acousticness", "liveness", "valence", "loudness"]; //4 = 0.43837215588957434
        // this.features = ["danceability", "energy", "acousticness", "valence"];                         //4 = 0.4638185356683445
        // this.features = ["danceability", "energy", "tempo", "valence"];                                //4 = 0.4414057733378225 --good 1/2
        // this.features = ["danceability", "energy", "acousticness", "valence", "loudness"];             //4 = 0.4658607200015974
        // this.features = ["danceability", "energy", "acousticness", "valence", "liveness"];             //4 = 0.4502874518540036 --good

        // this.initializeKRandomCentroids();
        // this.initializeKPlusPlusCentroids();
        this.initializeKPlusPlusCentroidsOptimized();
        this.iterations = 0;
        this.MAX_ITERATIONS = 15;
        this.iterate();
        return this.clusters;
    }

    /**
    * Summary. Forgy Method
    *
    * Description. Choose k centroids at random
    */
    initializeKRandomCentroids() {
        let length = this.data.length - 1;
        let arr = [];
        while (arr.length < this.k) {
            let x = Math.floor(Math.random() * length) + 1;
            if (arr.indexOf(x) === -1) arr.push(x);
        }

        let index = 0;
        for (let x of arr) {
            this.centroids[index] = this.data[x][1];
            index++;
        }
    }

    /*
    * Summary. K Means++ method - O(k^2 * n) - bad
    *
    * High Level Steps.
    * 1. choose one random centroid first
    * 2. for each data vector, find the minimum distance to all previously chosen centroids
    * 3. choose the next centroid as the data vector that has the largest min distance (furthest from all centroids)
    * */
    initializeKPlusPlusCentroids() {
        let n = this.data.length;

        let randomIndex = Math.floor(Math.random() * (n - 1)) + 1;
        this.centroids[0] = this.data[randomIndex][1];

        for (let currCentroid = 1; currCentroid < this.k; currCentroid++) {

            let minDistanceArray = []; // [[track, distance], [track, distance], ...]
            for (let track = 0; track < n; track++) {
                let minDistance = Infinity;
                for (let j = 0; j < currCentroid; j++) {
                    let tempDistance = this.distance(this.centroids[j], this.data[track][1]);
                    if (tempDistance < minDistance) {
                        minDistance = tempDistance;
                    }
                }
                minDistanceArray.push([this.data[track], minDistance]);
            }

            let furthestCentroid;
            let maxDistance = -Infinity;
            for (let entry of minDistanceArray) {
                if (entry[1] > maxDistance) {
                    maxDistance = entry[1];
                    furthestCentroid = entry[0];
                }
            }
            // console.log(maxDistance);
            this.centroids[currCentroid] = furthestCentroid[1];
        }

    }

    /**
     * Summary. K Means++ method - O(k * n) - good
     *
     * * for each value of k, the next centroid is the data point that is furthest from all centroids already found so far
     * * O(k*n) because for any centroid j where j=[0...k] and any track t in this.data, minDistanceMap will already have computed
     * the minimum distance from t to all centroids [0...j-2], therefore we only need to compute distance from t to
     * centroid[j-1] to update minDistanceMap. Then we find the furthest data point from all centroids [0...j-1],
     * let this data point be i and set centroids[j]=i. Continue to calculate rest of centroids
     *
     */
    initializeKPlusPlusCentroidsOptimized() {
        let n = this.data.length;
        let minDistanceMap = new Map();
        let randomIndex = Math.floor(Math.random() * (n - 1)) + 1;
        this.centroids[0] = this.data[randomIndex][1];

        for (let currCentroid = 1; currCentroid < this.k; currCentroid++) {
            let maxDistance = -Infinity;
            let furthestCentroid;
            // update the minDistance with last centroid, and also keep track of furthest centroid so far
            for (let track = 0; track < n; track++) {
                let trackID = this.data[track][0];
                let tempDistance = this.distance(this.centroids[currCentroid - 1], this.data[track][1]);
                if (!minDistanceMap.has(trackID) || minDistanceMap.get(trackID) > tempDistance) {
                    minDistanceMap.set(trackID, tempDistance);
                }
                let dist = minDistanceMap.get(trackID);
                if (dist > maxDistance) {
                    maxDistance = dist;
                    furthestCentroid = this.data[track][1];
                }
            }
            // console.log(maxDistance);
            this.centroids[currCentroid] = furthestCentroid;
        }
    }

    /**
     * Summary. Groups data points into clusters based on centroids and shifts centroids with each iteration.
     * Shifts centroids until the maximum distance between vecArray[i] and clusters[i] is no greater than this.meanValueLeniency
     *
     * * this.data = array of tracks where each track = [trackID, audioFeatures]
     * * this.centroids = array of k audio features
     * * this.clusters = array of k tracks where each track = [trackID, audioFeatures]
     * * vecArray = array of k audioFeatures, vecArray[i] is average of all audioFeatures for this.clusters[i]
     *
     * @throws KMeanIterationError - if more iterations than this.MAX_ITERATIONS
     * @throws KMeanClusterError - if don't find k clusters or a cluster is empty
     */
    iterate() {
        if (this.iterations > this.MAX_ITERATIONS) {
            throw new Err.KMeanIterationError(this.iterations, this.MAX_ITERATIONS);
        }
        this.clusters = new Array(this.k);
        let numFeatures = this.features.length;
        let vecArray = []; // vecArray[i] corresponds to cluster[i] and the sum of all the features

        for (let i = 0; i < this.k; i++) {
            vecArray[i] = {};
            for (let feature of this.features) {
                vecArray[i][feature] = 0;
            }
        }

        // group into clusters
        for (let track of this.data) {
            let index = this.findIndexOfNearestCentroid(track);

            if (this.clusters[index] == null || this.clusters[index] === undefined) this.clusters[index] = [];
            this.clusters[index].push(track);

            // sum up all features of track in vecArray
            for (let feature of this.features) {
                vecArray[index][feature] += track[1][feature];
            }
        }
        let maxDistance = 0;
        for (let i = 0; i < this.k; i++) {
            if (!this.clusters[i]) {
                throw new Err.KMeanClusterError("Less than K clusters for cluster: " + i);
            }
            let numTracks = this.clusters[i].length;
            if (numTracks === 0) {
                throw new Err.KMeanClusterError("Zero tracks in cluster: " + i);
            }
            // calculate the mean
            for (let feature of this.features) {
                vecArray[i][feature] = vecArray[i][feature] / numTracks;
            }
            let distance = this.distance(vecArray[i], this.centroids[i]);
            if (distance > maxDistance) maxDistance = distance;

        }

        // if true, then means centroids did not shift
        if (maxDistance <= this.meanValueLeniency) {
            console.log("kMean num iterations = " + this.iterations);
            return;
        }

        for (let i = 0; i < this.k; i++) {
            this.centroids[i] = vecArray[i];
        }
        this.iterations = this.iterations + 1;
        this.iterate();
    }

    findIndexOfNearestCentroid(track) {
        let minDistance = Infinity;
        let index = 0;

        for (let i = 0; i < this.k; i++) {
            let distance = this.distance(track[1], this.centroids[i]);
            if (distance < minDistance) {
                minDistance = distance;
                index = i;
            }
        }
        return index;
    }

    // TODO: research other types of distance (manhattan etc)
    distance(track1, track2) {
        let distance = 0;
        for (let feature of this.features) {
            distance += Math.pow(track1[feature] - track2[feature], 2);
        }
        return distance;
    }

    /**
     * Summary. Computes silhouette method
     *
     * Description. compute the mean s(i) for each data point i
     * * s(i) = 0 if |C(i)| = 1
     * * s(i) = (b(i)-a(i))/max(a(i), b(i))
     * * a(i) = similarity of i to cluster - average distance of i to every other point in cluster
     * * b(i) = dissimilarity of i to other clusters - minimum mean distance to all other clusters
     *
     * @param clusters Array of clusters where each cluster is a track [trackId, audioFeatureData]
     *
     * @return Returns array with bestK, clusters of the bestK, and map of all k values and their silhouetteValue's and clusters. map = {k: [silhouetteValue, clusters]} .
     */
    computeSilhouetteValue(clusters) {
        this.a = new Map();
        this.b = new Map();
        this.s = new Map();
        this.computeAForAllClusters(clusters);
        this.computeBForAllClusters(clusters);
        this.computeSForAllClusters(clusters);
        let sArray = Array.from(this.s.values());
        let sSize = sArray.length;
        let silhouetteValue = 0;
        for (let s of sArray) {
            silhouetteValue += s;
        }
        return silhouetteValue / sSize;
    }

    computeAForAllClusters(clusters) {
        for (let cluster of clusters) {
            if (cluster.length === 1) {
                let singleTrack = cluster[0];
                this.a.set(singleTrack[0], 0);
            } else {
                this.computeAForSingleCluster(cluster);
            }
        }
    }

    /**
     * Summary. Computes a value for a single cluster, similarity of i to cluster
     *
     * Description.
     * * for each data point i, calculate the average distance of i to every point in the same cluster
     *
     *
     * @param cluster
     */
    computeAForSingleCluster(cluster) {
        let n = cluster.length;
        for (let i = 0; i < n; i++) {
            let t1 = cluster[i];
            let sumDistance = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    let t2 = cluster[j];
                    sumDistance += this.distance(t1[1], t2[1]);
                }
            }
            this.a.set(t1[0], (sumDistance) / (n - 1));
        }
    }

    /**
     * Summary. Computes b value for a single cluster, dissimilarity of i to other clusters
     *
     * Description. Finds the minimum mean distance to all other clusters
     * * for each data point i, calculate the distance from i to cluster j (for each cluster j [0...k])
     * * distance between data point i and cluster j is the mean distance from i to every data point in cluster j
     * * find the minimum mean distance from i to all clusters [0...k]
     *
     * @param clusters
     */
    computeBForAllClusters(clusters) {
        for (let i = 0; i < this.k; i++) {
            let cluster = clusters[i];
            if (cluster.length === 1) {
                let singleTrack = cluster[0];
                this.b.set(singleTrack[0], 0);
            } else {
                for (let track of cluster) {
                    let minDistance = Infinity;
                    for (let j = 0; j < this.k; j++) {
                        if (i !== j) {
                            minDistance = Math.min(minDistance, this.computeMeanDistanceToCluster(track, clusters[j]));
                        }
                    }
                    this.b.set(track[0], minDistance);
                }
            }
        }
    }

    computeMeanDistanceToCluster(t1, cluster) {
        let n = cluster.length;
        let sumDistance = 0;
        for (let t2 of cluster) {
            sumDistance += this.distance(t1[1], t2[1]);
        }
        return sumDistance / n;
    }

    computeSForAllClusters(clusters) {
        for (let cluster of clusters) {
            for (let track of cluster) {
                let a = this.a.get(track[0]);
                let b = this.b.get(track[0]);
                if (a === b) {
                    this.s.set(track[0], 0);
                } else {
                    this.s.set(track[0], (b - a) / Math.max(a, b));
                    // let x = (b-a)/Math.max(a,b);
                    // if (x>1 || x<-1) console.log("UHOH" + track + " - "+x);
                }
            }
        }
    }

    /**
     * Description. Goes through range of k's and runs kMean algorithm and computes silhouetteValue for each k.
     *
     * @param data Object where key is trackID and value is track audio features
     *
     * @return Returns array with bestK, clusters of the bestK, and map of all k values and their silhouetteValue's and clusters. map = {k: [silhouetteValue, clusters]} .
     */
    getOptimalKClusters(data) {
        let k_START = 6;
        let k_END = 15;
        let map = new Map();
        // used a map for easier debugging
        for (let k = k_START; k <= k_END; k++) {
            try {
                let clusters = this.kMean(data, k);
                let silhouetteValue = this.computeSilhouetteValue(clusters);
                map.set(k, [silhouetteValue, clusters]);
            } catch (e) {
                map.set(k, [-Infinity, null]);
            }
        }
        let maxSilhouetteValue = -Infinity;
        let clusters = null;
        let bestK = null;
        for (let entry of map.entries()) {
            console.log(entry[0] + " - " + entry[1][0]);
            if (entry[1][0] > maxSilhouetteValue) {
                bestK = entry[0];
                clusters = entry[1][1];
                maxSilhouetteValue = entry[1][0];
            }
        }
        return [bestK, clusters, map];
    }

}

module.exports.KMean = KMean;