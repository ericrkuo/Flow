class KMean {

    // Object.keys, Object.values, Object.entries

    // NOTE TO SELF:
    // features = {f1,f2,f3,...}
    // track = [id, {f1,f2,f3,f4,...}]
    // data: [track1, track2, track3, ...]
    // centroids: [0: features0, 1: features1, ..., k: featuresk]
    // clusters: [0: [tracks], 1: [tracks], 2: [tracks], ..., k: [tracks]]
    // vecArray: [0: features0, 1: features1, ..., k: featuresk]

    /*
    * high level steps
    * 1. choose k random centroids
    * 2. move each data vector to closest centroid, so create the clusters
    * 3. recalculate the means of the centroids
    * 4. if centroids shifted, redo steps, otherwise return clusters
    * */

    // TODO: add max iterations for safety
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
        this.initializeKPlusPlusCentroids();
        this.iterations = 0; //TODO: delete later for testing purposes
        this.iterate();
        return this.clusters;
    }

    // FORGY METHOD
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
    * high level steps
    * 1. choose one random centroid first
    * 2. for each data vector, find the minimum distance to all previously chosen centroids
    * 3. choose the next centroid as the data vector that has the largest min distance (furthest from all centroids)
    * */

    // K Means++ method
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

    iterate() {
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
            if (this.clusters[i] == null) {
                console.log("LESS THAN K CLUSTERS - use another k");
                throw new Error();
            }
            let numTracks = this.clusters[i].length;
            if (numTracks === 0) {
                console.log("ZERO TRACKS IN CLUSTER");
                // TODO: handle ERROR BETTER
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
            // console.log(this.iterations); // TODO: delete later
            return;
        }

        for (let i = 0; i < this.k; i++) {
            this.centroids[i] = vecArray[i];
        }
        this.iterations = this.iterations + 1; // TODO: delete later
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

    // SILHOUETTE METHOD FOR DIFFERENT VALUES OF K
    /*
    * high level steps
    * compute the mean s(i), for each data point i
    * s(i) = 0 if |C(i)| = 1
    * s(i) = (b(i)-a(i))/max(a(i), b(i))
    * a(i) = similarity of i to cluster - average distance of i to every other point in cluster
    * b(i) = dissimilarity of i to other clusters - minimum mean distance to all other clusters
    * */

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

    getOptimalKClusters(data) {
        // TODO: play around with values of k
        let k_START = 6;
        let k_END = 15;
        let arr = new Map();
        for (let k = k_START; k <= k_END; k++) {
            try {
                let clusters = this.kMean(data, k);
                let silhouetteValue = this.computeSilhouetteValue(clusters);
                arr.set(k, [silhouetteValue, clusters]);
            } catch (e) {
                arr.set(k, [-Infinity, null]);
            }
        }
        let maxSilhouetteValue = -Infinity;
        let clusters = null;
        for (let entry of Array.from(arr.entries())) {
            console.log(entry[0] + " - " + entry[1][0]);
            if (entry[1][0] > maxSilhouetteValue) {
                clusters = entry[1][1];
                maxSilhouetteValue = entry[1][0];
            }
        }
        return clusters;
    }

}

module.exports.KMean = KMean;