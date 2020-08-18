const {KMean} = require("./KMean");
const {AzureFaceAPI} = require("./AzureFaceAPI");
const {Spotify} = require("./Spotify");
const {Emotion} = require("./Emotion");
const SpotifyWebApi = require('spotify-web-api-node');


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
    constructor() {
        this.dataURL = null;
        this.azureFaceAPI = new AzureFaceAPI();
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        this.emotion = new Emotion(this.spotifyApi);
        this.spotify = new Spotify(this.spotifyApi);
        this.kMean = new KMean();
        this.result = null;
    }

    // REQUIRES. this.dataURL to be set
    getRelevantSongs() {
        if (!this.dataURL) {
            throw new Error("DATA URL is not set");
        }
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
            .then((audioFeatureData) => {
                audioFeatureData["X"] = songX[1];
                let [bestK, clusters, map] = this.kMean.getOptimalKClusters(audioFeatureData);
                let arrayOfSongIDS = this.getSongIDsOfClusterContainingSongX(clusters);
                this.printOutAllSongTitles(arrayOfSongIDS);
                let newArrayOfSongIDS = this.getDesiredNumberSongs(bestK, arrayOfSongIDS, map);
                // TODO: fix this since setResults is async once fix Azure api
                this.setResults(newArrayOfSongIDS, audioFeatureData, this.spotify.mood, null); // TODO: add emotions
                return newArrayOfSongIDS;
            })
            .catch((err) => {
                if(this.spotify.checkCredentials()) {
                    console.log(err);
                    throw err;
                } else {
                    this.spotify.getNewAccessToken().then((access_token) => {
                        this.spotify.spotifyApi.setAccessToken(access_token);
                        this.emotion.spotifyApi.setAccessToken(access_token);
                        if(this.spotify.checkCredentials()) {
                            return this.getRelevantSongs();
                        } else {
                            throw new Error("Failed to update credentials");
                        }
                    })
                }
            })
    }

    getRelevantSongsTestingPurposes() {
        let songX;
        let dominantEmotion = "happiness";
        let newArrayOfSongIDS
        let emotions = {
            "anger": 0.575,
            "contempt": 0,
            "disgust": 0.006,
            "fear": 0.008,
            "happiness": 0.394,
            "neutral": 0.013,
            "sadness": 0,
            "surprise": 0.004
        };
        return this.emotion.getFeatures(dominantEmotion)
            .then((feature) => {
                songX = ["X", feature];
                this.spotify.mood = dominantEmotion;
                return this.spotify.getAllAudioFeatures();
            })
            .then((audioFeatureData) => {
                audioFeatureData["X"] = songX[1];
                let [bestK, clusters, map] = this.kMean.getOptimalKClusters(audioFeatureData);
                let arrayOfSongIDS = this.getSongIDsOfClusterContainingSongX(clusters);
                this.printOutAllSongTitles(arrayOfSongIDS);
                newArrayOfSongIDS = this.getDesiredNumberSongs(bestK, arrayOfSongIDS, map);
                return this.setResults(newArrayOfSongIDS, audioFeatureData, this.spotify.mood, emotions);
            })
            .then((res) => {
                let self = this;
                return newArrayOfSongIDS;
            })
            .catch((err) => {
                if(this.spotify.checkCredentials()) {
                    console.log(err);
                    throw err;
                } else {
                    this.spotify.getNewAccessToken().then((access_token) => {
                        this.spotify.spotifyApi.setAccessToken(access_token);
                        this.emotion.spotifyApi.setAccessToken(access_token);
                        if(this.spotify.checkCredentials()) {
                            return this.getRelevantSongsTestingPurposes();
                        } else {
                            throw new Error("Failed to update credentials");
                        }
                    })
                }
            })
    }

    // PURPOSE - set the results for global access inside trackRouter.js
    // result = {tracks: trackObjects, userInfo: userInfoObject, mood: {dominantMood, {happiness: 0.8, sadness: 0.2}}}
    // trackObjects = {{id: {track, audioFeatures}}, {id: {track, audioFeatures}}, {id: {track, audioFeatures}}, ...}
    setResults(songIDs, audioFeatureData, mood, emotions) {
        this.result = {tracks: {}, userInfo: {}, mood: {}};
        for (let songID of songIDs) {
            this.result.tracks[songID] = {
                track: this.spotify.trackHashMap.get(songID),
                audioFeatures: audioFeatureData[songID]
            };
        }

        this.result.mood.dominantMood = mood;
        this.result.mood.emotions = emotions;

        return this.spotify.getUserInfo()
            .then((res) => {
                this.result.userInfo = res;
            }).catch((err) => {
                throw err;
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

    // REQUIRES: array of track URIs in format ["spotify:track:1ue7zm5TVVvmoQV8lK6K2H", ...]
    createMoodPlaylist(tracks) {
        return this.spotify.getNewPlaylist(tracks);
    }
}

module.exports.Main = Main;