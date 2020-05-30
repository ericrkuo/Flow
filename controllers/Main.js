const {KMean} = require("./KMean");
const {AzureFaceAPI} = require("./AzureFaceAPI");
const {Spotify} = require("./Spotify");
const {Emotion} = require("./Emotion");

class Main {
    /*
    * high level steps
    * 1. receive a dataURL from image
    * 2. use AzureFaceAPI.js to get the emotions
    * 3. decide on dominant emotion
    * 4. get song features of emotion from Emotion.js
    * 5. get all user related songs from Spotify.js
    * 6. add song X to data
    * 7. pass data into KMean to get cluster results
    * 8. find song X in cluster
    * 9. return song titles for now //TODO: decide what to return
    * */

    // TODO: use other Spotify constructor when doing frontEnd that takes in clients access and refresh token
    constructor(dataURL) {
        this.dataURL = dataURL;
        this.emotion = new Emotion();
        this.azureFaceAPI = new AzureFaceAPI();
        this.spotify = new Spotify();
        this.kMean = new KMean();
    }

    getRelevantSongs() {
        let songX;
        return this.azureFaceAPI.getEmotions(this.dataURL)
            .then((res) => {
                let dominantEmotion = this.emotion.getDominantExpression(res);
                this.spotify.mood = dominantEmotion;
                return this.emotion.getFeatures(dominantEmotion);
            })
            .then((feature) => {
                songX = ["X", feature];
                this.spotify.trackHashMap.set("X", feature);
                return this.spotify.getAllAudioFeatures();
            })
            .then(() => {
                let [bestK, clusters, map] = this.kMean.kMean(this.spotify.trackHashMap, this.k);
                for (let cluster of clusters) {
                    if (cluster.contains(songX)) {
                        this.printOutAllSongTitles(cluster);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                return err;
            })
    }

    getRelevantSongsTestingPurposes() {
        let songX;
        let dominantEmotion = "happiness";
        return this.emotion.getFeatures(dominantEmotion)
            .then((feature) => {
                songX = ["X", feature];
                this.spotify.mood = dominantEmotion;
                return this.spotify.getAllAudioFeatures();
            })
            .then((data) => {
                data["X"] = songX[1];
                let [bestK, clusters, map] = this.kMean.getOptimalKClusters(data);
                let arrayOfSongIDS = this.getSongIDsOfClusterContainingSongX(clusters);
                this.printOutAllSongTitles(arrayOfSongIDS);
                let newArrayOfSongIDS = this.getDesiredNumberSongs(bestK, arrayOfSongIDS, map);
                console.log();
            })
            .catch((err) => {
                console.log(err);
                return err;
            })
    }

    // returns an array of songIDs for the cluster that contains songX
    getSongIDsOfClusterContainingSongX(clusters) {
        for (let cluster of clusters) {
            for (let song of cluster) {
                if (song[0] === "X") {
                    return this.getSongIDSFromCluster(cluster);
                }
            }
        }
    }

    getSongIDSFromCluster(cluster) {
        let arr = [];
        for (let song of cluster) {
            if (song[0] !== "X") arr.push(song[0]);
        }
        return arr;
    }

    getDesiredNumberSongs(bestK, arrayOfSongIDS, map) {
        let DESIRED_NUM_SONGS = 30;
        let n = arrayOfSongIDS.length;
        console.log("ORIGINAL NUMBER OF SONGS: " + n);

        if (n >= DESIRED_NUM_SONGS) {
            return arrayOfSongIDS.slice(0, DESIRED_NUM_SONGS);
        } else {
            // sorted map based on Silhouette value
            let sortedMap = Array.from(map.entries()).sort((x, y) => {
                if (x[1][0] < y[1][0]) return 1;
                if (x[1][0] > y[1][0]) return -1;
                return 0;
            });
            let set = new Set();
            for (let id of arrayOfSongIDS) {
                if (id !== "X") {
                    set.add(id);
                }
            }
            // for each entry of the map, add in the song IDs to the set until set reaches DESIRED_NUM_SONGS or iterated through entire map array
            for (let entry of sortedMap) {
                if (entry[0] !== bestK) {
                    let clusters = entry[1][1];
                    let cluster = this.getSongIDsOfClusterContainingSongX(clusters);
                    for (let id of cluster) {
                        if (id !== "X") {
                            set.add(id);
                        }
                    }
                    if (set.size >= DESIRED_NUM_SONGS) return Array.from(set.values()).slice(0, DESIRED_NUM_SONGS);
                }
            }
            // IF still doesn't have DESIRED_NUM_SONGS, just return as much as we can
            return Array.from(set.values()).slice(0, DESIRED_NUM_SONGS);
        }
    }

    printOutAllSongTitles(cluster) {
        for (let song of cluster) {
            if (song !== "X") {
                console.log(this.spotify.trackHashMap.get(song).name);
            }
        }
    }
}

module.exports.Main = Main;