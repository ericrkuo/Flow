const SpotifyWebApi = require('spotify-web-api-node');

class Spotify {

    /*
    * addRecentlyPlayedTracks()  - 50
    * addTopTracks()             - 100
    * addSavedTracks()           - 150
    * addTopArtistTracks()       - 200
    * addSeedTracks()            - 100
    * addUserPlaylistsTracks     - 100
    * addAllTracksToHashMap()
    * getAllAudioFeatures() - adds all tracks to hashmap and gets all the audio features
    * */


    // TODO: turn add___ functions into get___ and then use universal add(get___));
    // TODO: create new constructor for frontend taking in two parameters (access token and refresh token)
    constructor() {
        require('dotenv').config();
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        this.spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        // this.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        this.trackHashMap = new Map();
    }

    sampleFunction() {
        return this.spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE');
    }

    addAllTracksToHashMap() {
        let promises = [];
        promises.push(this.addRecentlyPlayedTracks());
        promises.push(this.addTopTracks());
        promises.push(this.addSavedTracks());
        promises.push(this.addSeedTracks());
        promises.push(this.addTopArtistsTracks());
        promises.push(this.addUserPlaylistsTracks());
        return Promise.all(promises)
            .then((res) => {
                console.log("SUCCESS - added all " + this.trackHashMap.size + " tracks to hashmap")
                return true;
            })
            .catch((err) => {
                console.log("ERROR" - err);
                throw err
            })
    }

    // get recent history objects
    addRecentlyPlayedTracks() {
        return this.spotifyApi.getMyRecentlyPlayedTracks({limit: 50})
            .then((res) => {
                this.addHistoryObjectTracksToHashMap(res.body.items);
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    addHistoryObjectTracksToHashMap(historyObjects) {
        if (historyObjects == null || historyObjects.length === 0) {
            console.log("tracks is empty or null");
            return;
        }
        for (let historyObject of historyObjects) {
            let track = historyObject["track"];
            this.trackHashMap.set(track["id"], track);
        }
    }

    addTopTracks() {
        let options = [{limit: 50}, {limit: 50, offset: 49}];
        let promises = [];
        for (let option of options) {
            promises.push(this.spotifyApi.getMyTopTracks(option));
        }
        return Promise.all(promises)
            .then((topTracksArray) => {
                for (let topTracks of topTracksArray) {
                    this.addTracksToHashMap(topTracks.body.items);
                }
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }


    addTracksToHashMap(tracks) {
        if (tracks == null || tracks.length === 0) {
            console.log("tracks is empty or null");
            return;
        }
        for (let track of tracks) {
            this.trackHashMap.set(track["id"], track);
        }
    }

    addSavedTracks() {
        let options = [{limit: 50}, {limit: 50, offset: 50}, {limit: 50, offset: 100}];
        let promises = [];
        for (let option of options) {
            promises.push(this.spotifyApi.getMySavedTracks(option));
        }
        return Promise.all(promises)
            .then((savedTracksArray) => {
                for (let savedTracks of savedTracksArray) {
                    let arr = [];
                    for (let item of savedTracks.body.items) arr.push(item.track);
                    this.addTracksToHashMap(arr);
                }
                return true;
            }).catch((err) => {
                console.log(err);
                throw err;
            });
    }

    addTopArtistsTracks() {
        let promises = [];
        let topArtists;

        return this.spotifyApi.getMyTopArtists({limit: 20, time_range: "long_term"})
            .then((res) => {
                topArtists = res.body.items;
                for (let topArtist of topArtists) {
                    promises.push(this.addArtistTopTracks(topArtist));
                }
                return Promise.all(promises);
                // }).then((res) => {
                //     promises = [];
                //     // for (let topArtist of topArtists) {
                //         promises.push(this.addSimilarArtistsTopTracks(topArtists[0]));
                //     // }
                //     return Promise.all(promises);
            }).then((res) => {
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    // TODO: make function work for other country codes, outer call for loop on possible country codes if none for US
    addArtistTopTracks(artist) {
        return this.spotifyApi.getArtistTopTracks(artist.id, "US")
            .then((res) => {
                // MAX returns 10 tracks
                let tracks = res.body.tracks;
                this.addTracksToHashMap(tracks);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    addSimilarArtistsTopTracks(artist) {
        let promises = [];
        return this.spotifyApi.getArtistRelatedArtists(artist.id)
            .then((res) => {
                // MAX returns 20
                let similarArtists = res.body.artists;
                let n = Math.min(similarArtists.length, 1);
                for (let i = 0; i < n; i++) {
                    promises.push(this.addArtistTopTracks(similarArtists[i]));
                }
                return Promise.all(promises);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    // TODO: refactor so that doesnt depend on function, make it a // REQUIRES that TrackHashMap cannot be empty, or decide something else
    getAllAudioFeatures() {
        return this.addAllTracksToHashMap()
            .then(() => {
                // get array of array of ids (split into 100)
                let promises = [];
                let trackIDS = Array.from(this.trackHashMap.keys());

                while (trackIDS.length !== 0) {
                    // getAudioFeatures has max of 100
                    let subsetOfTrackIDS = trackIDS.splice(0, 100);
                    promises.push(this.getAudioFeatures(subsetOfTrackIDS));
                }
                return Promise.all(promises);
                // return res[] of all the audio features
            }).then((res) => {
                // then create json objects with {"id" : {"Acoustic": 0.35, "Danceability":0.96, ...}, "id" : {...} }
                let data = {};
                let loudMIN = -60;
                let loudMAX = 0;
                let tempoMIN = 0;
                let tempoMAX = 250; // TODO: maybe disclude tempoMAX because dont know strict upper bound
                for (let audioFeatures of res) {
                    audioFeatures = audioFeatures.body["audio_features"];
                    for (let audioFeature of audioFeatures) {
                        let id = audioFeature.id;
                        data[id] = {
                            "danceability": audioFeature.danceability,
                            "energy": audioFeature.energy,
                            "loudness": (audioFeature.loudness - loudMIN) / (loudMAX - loudMIN),
                            "speechiness": audioFeature.speechiness,
                            "acousticness": audioFeature.acousticness,
                            "instrumentalness": audioFeature.instrumentalness,
                            "liveness": audioFeature.liveness,
                            "valence": audioFeature.valence,
                            "tempo": (audioFeature.tempo - tempoMIN) / (tempoMAX - tempoMIN)
                        };
                    }
                }
                return data;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            })
    }

    getAudioFeatures(tracks) {
        return this.spotifyApi.getAudioFeaturesForTracks(tracks)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log("COULD NOT GET AUDIO FEATURES");
                throw err;
            });
    }

    // TODO: get users saved albums and the tracks inside those albums
    // TODO: get tracks from playlist (maybe not)
    /*
    * get recommendations based on seeds (browse)
    *   - browse by genres (happy,sad) https://developer.spotify.com/console/get-available-genre-seeds/
    *   - put in seed tracks and seed artists for more recommendations (personalized to user)
    *   - NOTE** only 5 seeds max total
    * get 50 happy, 50 sad, 50 chill, 50 ambient,  50 for top 5 artist, 50 for top 5 track
    * */
    addSeedTracks() {
        let promises = [];
        // let optionsArray = [
        //     {limit: 100, seed_genres: "sad"},
        //     // {limit: 100, seed_genres: "chill, ambient"},
        //     {limit: 100, seed_genres: "happy"},
        //     {limit: 100, seed_genres: "chill"}
        //
        // ];

        // TODO: can remove the array if don't want multiple options
        // TODO: fill out rest of arrays
        let emotionToSeed = {
            anger: [{
                limit: 100,
                // seed_genres: "hardcore, heavy-metal, death-metal, hard-rock, punk",
                seed_genres: "death-metal, punk",
                seed_tracks: "2vwlzO0Qp8kfEtzTsCXfyE,3xrn9i8zhNZsTtcoWgQEAd,7K5dzhGda2vRTaAWYI3hrb",
                max_valence: 0.15
            }],
            contempt: [{
                limit: 100,
                seed_genres: "death-metal, hardcore",
                seed_tracks: "2vwlzO0Qp8kfEtzTsCXfyE,1KGi9sZVMeszgZOWivFpxs,5vTPxzm4h2bY9rYyVrGEU5"
            }], // described as combo of disgust + anger
            disgust: [{
                limit: 100,
                seed_genres: "heavy-metal, hardcore",
                seed_tracks: "1KGi9sZVMeszgZOWivFpxs,5vTPxzm4h2bY9rYyVrGEU5,6rUp7v3l8yC4TKxAAR5Bmx,",
                max_valence: 0.15}],
            fear: [{
                limit: 100,
                // seed_genres: "chill, sleep, acoustic, ambient",
                seed_tracks: "1egVLpTrGvaWtUcR2xDoaN,45Zo6ftGzq6wRckCUrMoBJ,7CZvsEFFZffXJ4HxLWtaQc,45Zo6ftGzq6wRckCUrMoBJ,688DZF6e1MH5Uf409dwaHm",
                target_valence: 0.5}], // same as neutral
            happiness: [{
                limit: 100,
                seed_genres: "happy, hip-hop, summer, pop, party",
                min_energy: 0.8,
                min_valence: 0.8
            }],
            neutral: [{limit: 100, seed_genres: "chill, sleep, acoustic, ambient", target_valence: 0.5}],
            sadness: [{limit: 100, seed_genres: "sad, blues, rainy-day, r-n-b", max_energy: 0.3, max_valence: 0.3}],
            surprise: [{limit: 100, seed_genres: "hardstyle, work-out, edm, party"}]
        };

        if (this.mood === undefined) this.mood = "happiness"; //default mood
        let optionsArray = emotionToSeed[this.mood];
        for (let option of optionsArray) {
            promises.push(this.spotifyApi.getRecommendations(option));
        }
        return Promise.all(promises)
            .then((resArray) => {
                for (let res of resArray) {
                    let tracks = res.body.tracks;
                    this.addTracksToHashMap(tracks);
                }
                // TODO: comment out
                // let y = [];
                // for (let entry of Array.from(this.trackHashMap.entries())) {
                //     y.push(entry[0]);
                // }
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            })
    }


    getListOfUserPlaylistsIDs() {
        return this.spotifyApi.getUserPlaylists()
            .then((res) => {
                let playlists = res.body.items;
                let playlistsIDs = [];
                for (let playlist of playlists) {
                    playlistsIDs.push(playlist.id);
                }
                return playlistsIDs;
            })
            .catch((err) => {
                console.log("COULD NOT GET USER'S PLAYLISTS IDS");
                throw err;
            });
    }


    addUserPlaylistsTracks() {
        let allPlaylistTracks = [];
        let NUM_TRACKS_FOR_EACH_PLAYLIST = 100;
        return this.getListOfUserPlaylistsIDs()
            .then((playlistIDs) => {
                let promises = [];
                let numSongs = Math.floor(NUM_TRACKS_FOR_EACH_PLAYLIST / playlistIDs.length);
                for (let id of playlistIDs) {
                    promises.push(this.spotifyApi.getPlaylistTracks(id, {limit: numSongs}))
                }

                return Promise.all(promises)
                    .then((res) => {
                        let numPlaylists = res.length;

                        for (let i = 0; i < numPlaylists; i++) {
                            let tracks = res[i]["body"]["items"];
                            for (let track of tracks) {
                                allPlaylistTracks.push(track.track);
                            }
                        }

                        this.addTracksToHashMap(allPlaylistTracks);
                        return true;
                    })
            })
            .catch((err) => {
                console.log("COULD NOT GET LIST OF USER PLAYLISTS IDS FROM getListOfUserPlaylistsTracks");
                throw err;
            })
    }

}

module.exports.Spotify = Spotify;