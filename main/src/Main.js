const {KMean} = require("./clustering/KMean");
const {AzureFaceAPIService} = require("./service/AzureFaceAPIService");
const {SpotifyService} = require("./service/SpotifyService");
const {EmotionService} = require("./service/EmotionService");
const SpotifyWebApi = require("spotify-web-api-node");
const Err = require("./constant/Error");
const {RefreshCredentialService} = require("./service/RefreshCredentialService");
const DESIRED_NUM_SONGS = 30;

class Main {

    /**
     * ====== High-level Steps ======
     * 1. Receive a dataURL from image
     * 2. Use AzureFaceAPIService.js to get the emotions
     * 3. Decide on dominant emotion
     * 4. Get song features of emotion from EmotionService.js
     * 5. Get all user related songs from SpotifyService.js
     * 6. Add song X to data
     * 7. Pass data into KMean to get cluster results
     * 8. Find song X in cluster
     * 9. Get songs in cluster containing song X
     * 10. Get desired number of songs (currently 30) if cluster has too much or too little
     * 11. Return result from getResults
     */
    constructor() {
        require("dotenv").config();
        this.dataURL = null;
        this.azureFaceAPIService = new AzureFaceAPIService();
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        this.emotionService = new EmotionService(this.spotifyApi);
        this.spotifyService = new SpotifyService(this.spotifyApi);
        this.kMean = new KMean();
        this.refreshCredentialService = new RefreshCredentialService(this.spotifyApi);
    }

    /**
     * Gets the relevant songs for current user based on kMeans clustering with dominant mood
     * Requires this.dataURL to be set
     * @returns {Promise<never>|Promise<* | void>}
     */
    getRelevantSongs() {
        if (!this.dataURL) {
            return Promise.reject(new Err.InvalidDataURLError());
        }
        let songX;
        let newArrayOfSongIDS;
        let emotions;
        return this.azureFaceAPIService.getEmotions(this.dataURL)
            .then((res) => {
                emotions = res;
                const dominantEmotion = this.emotionService.getDominantExpression(res);
                this.spotifyService.mood = dominantEmotion;
                return this.emotionService.getFeatures(dominantEmotion);
            })
            .then((feature) => {
                songX = ["X", feature];
                this.spotifyService.trackHashMap.set("X", feature);
                return this.spotifyService.getAllAudioFeatures();
            })
            .then((audioFeatureData) => {
                audioFeatureData["X"] = songX[1];
                const [bestK, clusters, map] = this.kMean.getOptimalKClusters(audioFeatureData);
                const arrayOfSongIDS = this.getSongIDsOfClusterContainingSongX(clusters);
                newArrayOfSongIDS = this.getDesiredNumberSongs(bestK, arrayOfSongIDS, map);
                return this.getResults(newArrayOfSongIDS, audioFeatureData, this.spotifyService.mood, emotions);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    /**
     * Gets relevant songs for current user based on kMeans clustering with dominant mood, for testing purposes
     * @returns {Promise<never>|Promise<* | void>}
     */
    getRelevantSongsTestingPurposes() {
        if (!this.dataURL) {
            return Promise.reject(new Err.InvalidDataURLError());
        }
        let songX;
        const dominantEmotion = "happiness";
        let newArrayOfSongIDS;
        const emotions = {
            "anger": 0.575,
            "contempt": 0,
            "disgust": 0.006,
            "fear": 0.008,
            "happiness": 0.394,
            "neutral": 0.013,
            "sadness": 0,
            "surprise": 0.004,
        };
        return this.emotionService.getFeatures(dominantEmotion)
            .then((feature) => {
                songX = ["X", feature];
                this.spotifyService.mood = dominantEmotion;
                return this.spotifyService.getAllAudioFeatures();
            })
            .then((audioFeatureData) => {
                audioFeatureData["X"] = songX[1];
                const [bestK, clusters, map] = this.kMean.getOptimalKClusters(audioFeatureData);
                const arrayOfSongIDS = this.getSongIDsOfClusterContainingSongX(clusters);
                newArrayOfSongIDS = this.getDesiredNumberSongs(bestK, arrayOfSongIDS, map);
                return this.getResults(newArrayOfSongIDS, audioFeatureData, this.spotifyService.mood, emotions);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    /**
     * Sets the results for global access inside trackRouter.js
     * trackObjects = {{id: {track, audioFeatures}}, {id: {track, audioFeatures}}, {id: {track, audioFeatures}}, ...}
     * @param songIDs - list of track IDs
     * @param audioFeatureData - audio features for tracks
     * @param mood - dominant mood
     * @param emotions - current user's emotions
     * @returns {Promise<T | void>}
     *          of this format {tracks: trackObjects, userInfo: userInfoObject, mood: {dominantMood, {happiness: 0.8, sadness: 0.2}}}
     */
    getResults(songIDs, audioFeatureData, mood, emotions) {
        const result = {tracks: {}, userInfo: {}, mood: {}};
        for (const songID of songIDs) {
            result.tracks[songID] = {
                track: this.spotifyService.trackHashMap.get(songID),
                audioFeatures: audioFeatureData[songID],
            };
        }

        result.mood.dominantMood = mood;
        result.mood.emotions = emotions;

        return this.spotifyService.getUserInfo()
            .then((res) => {
                result.userInfo = res;
                return result;
            }).catch((err) => {
                throw err;
            });
    }

    /**
     * Returns an array of songIDs for the cluster that contains songX
     * @param clusters - current group of clusters
     * @returns {string[]} - list of song IDs
     */
    getSongIDsOfClusterContainingSongX(clusters) {
        for (const cluster of clusters) {
            for (const song of cluster) {
                if (song[0] === "X") {
                    return this.getSongIDSFromCluster(cluster);
                }
            }
        }
    }

    /**
     * Gets the song IDs of tracks in the cluster
     * @param cluster - current group of clusters
     * @returns {string[]} - array of song IDs
     */
    getSongIDSFromCluster(cluster) {
        const arr = [];
        for (const song of cluster) {
            if (song[0] !== "X") arr.push(song[0]);
        }
        return arr;
    }

    /**
     * Returns desired number of songs
     * @param bestK - ideal K value
     * @param arrayOfSongIDS - group of song IDs
     * @param map - mapping from kMean clustering
     * @returns {any[]|*}
     */
    getDesiredNumberSongs(bestK, arrayOfSongIDS, map) {
        const n = arrayOfSongIDS.length;
        console.log("ORIGINAL NUMBER OF SONGS: " + n);

        if (n >= DESIRED_NUM_SONGS) {
            return arrayOfSongIDS.slice(0, DESIRED_NUM_SONGS);
        } else {
            // sorted map based on Silhouette value
            const sortedMap = Array.from(map.entries()).sort((x, y) => {
                if (x[1][0] < y[1][0]) return 1;
                if (x[1][0] > y[1][0]) return -1;
                return 0;
            });
            const set = new Set();
            for (const id of arrayOfSongIDS) {
                if (id !== "X") {
                    set.add(id);
                }
            }
            // for each entry of the map, add in the song IDs to the set until set reaches DESIRED_NUM_SONGS or iterated through entire map array
            for (const entry of sortedMap) {
                if (entry[0] !== bestK) {
                    const clusters = entry[1][1];
                    const cluster = this.getSongIDsOfClusterContainingSongX(clusters);
                    for (const id of cluster) {
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

    /**
     * Prints out all song titles
     * @param cluster - current group of cluster
     */
    printOutAllSongTitles(cluster) {
        for (const song of cluster) {
            if (song !== "X") {
                console.log(this.spotifyService.trackHashMap.get(song).name);
            }
        }
    }

    /**
     * Calls for creation of new Spotify playlist based on user's dominant mood
     * Requires array of track URIs in format ["spotify:track:1ue7zm5TVVvmoQV8lK6K2H", ...]
     * @param tracks - tracks in final result for user
     * @returns {Promise<never>} - new playlist body from SpotifyService
     */
    createMoodPlaylist(tracks) {
        return this.spotifyService.getNewPlaylist(tracks);
    }
}

module.exports.Main = Main;
