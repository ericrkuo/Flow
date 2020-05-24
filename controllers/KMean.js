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
        this.features = ["danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"];
        // this.initializeKRandomCentroids();
        this.initializeKPlusPlusCentroids();
        this.iterations = 0; //TODO: delete later for testing purposes
        this.iterate();
        return this.clusters;
    }

    // TODO: optimize choosing k random centroids
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
            for(let entry of minDistanceArray) {
                if (entry[1] > maxDistance) {
                    maxDistance = entry[1];
                    furthestCentroid = entry[0];
                }
            }
            console.log(maxDistance);
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
            console.log(this.iterations); // TODO: delete later
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


}

module.exports.KMean = KMean;