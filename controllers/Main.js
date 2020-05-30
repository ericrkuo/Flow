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
                let clusters = this.kMean.kMean(this.spotify.trackHashMap, this.k);
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
        let dominantEmotion = "sadness";
        return this.emotion.getFeatures(dominantEmotion)
            .then((feature) => {
                songX = ["X", feature];
                this.spotify.mood = dominantEmotion;
                return this.spotify.getAllAudioFeatures();
            })
            .then((data) => {
                data["X"] = songX[1];
                let clusters = this.kMean.getOptimalKClusters(data);
                for (let cluster of clusters) {
                    for (let song of cluster) {
                        if (song[0] === "X"){
                            this.printOutAllSongTitles(cluster);
                            break;
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                return err;
            })
    }

    printOutAllSongTitles(cluster) {
        for (let song of cluster) {
            if (song[0] !== "X") {
                console.log(this.spotify.trackHashMap.get(song[0]).name);
            }
        }
    }
}

module.exports.Main = Main;