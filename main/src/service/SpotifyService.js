const Err = require("../constant/Error");
const {executeMethod} = require("./SpotifyApiWrapper");

class SpotifyService {

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


    constructor(spotifyApi) {
        this.spotifyApi = spotifyApi;
        this.trackHashMap = new Map();
        this.mood = "happiness"; // default
    }

    sampleFunction() {
        return executeMethod( () => {
            return this.spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE');
        });
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
            .then(() => {
                console.log("SUCCESS - added all " + this.trackHashMap.size + " tracks to hashmap")
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    addTracksToHashMap(tracks) {
        if (!tracks || tracks.length === 0 || !Array.isArray(tracks)) {
            console.log("tracks is empty or null");
            return;
        }
        for (let track of tracks) {
            this.trackHashMap.set(track["id"], track);
        }
    }

    isResponseBodyItemsValid(res) {
        return res && res.body && res.body.items;
    }

    isResponseBodyTracksValid(res) {
        return res && res.body && res.body.tracks;
    }

    // NOTE: if listened to song X 10 times, will return song X 10 times in the array
    addRecentlyPlayedTracks() {
        return executeMethod(
            () => {
                return this.spotifyApi.getMyRecentlyPlayedTracks({limit: 50})
            })
            .then((res) => {
                if (!this.isResponseBodyItemsValid(res)) return false;
                let tracks = [];
                for (let item of res.body.items) {
                    if (item && item.track) {
                        tracks.push(item.track);
                    }
                }
                this.addTracksToHashMap(tracks);
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    addTopTracks() {
        let options = [{limit: 50}, {limit: 50, offset: 49}];
        let promises = [];
        for (let option of options) {
            promises.push(executeMethod(
                () => {
                    return this.spotifyApi.getMyTopTracks(option)
                }
            ));
        }
        return Promise.all(promises)
            .then((topTracksArray) => {
                if (!topTracksArray) return false;
                for (let topTracks of topTracksArray) {
                    if (!this.isResponseBodyItemsValid(topTracks)) return false;
                    this.addTracksToHashMap(topTracks.body.items);
                }
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    addSavedTracks() {
        let options = [{limit: 50}, {limit: 50, offset: 50}, {limit: 50, offset: 100}];
        let promises = [];
        for (let option of options) {
            promises.push(executeMethod(
                () => {
                    return this.spotifyApi.getMySavedTracks(option)
                }
            ));
        }
        return Promise.all(promises)
            .then((savedTracksArray) => {
                if (!savedTracksArray) return false;
                for (let savedTracks of savedTracksArray) {
                    if (!this.isResponseBodyItemsValid(savedTracks)) return false;
                    let tracks = [];
                    for (let item of savedTracks.body.items) {
                        if (item && item.track) {
                            tracks.push(item.track);
                        }
                    }
                    this.addTracksToHashMap(tracks);
                }
                return true;
            }).catch((err) => {
                console.log(err);
                throw err;
            });
    }

    addTopArtistsTracks() {
        return executeMethod(
            () => {
                return this.spotifyApi.getMyTopArtists({limit: 20, time_range: "long_term"})
            }
        )
            .then((res) => {
                let promises = [];
                if (!this.isResponseBodyItemsValid(res)) return false;
                for (let item of res.body.items) {
                    if (item && item.id) promises.push(this.addArtistTopTracks(item));
                }
                return Promise.all(promises);
            }).then(() => {
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });

        // adding similar artists and their top tracks
        // }).then((res) => {
        //     promises = [];
        //     for (let topArtist of topArtists) {
        //         promises.push(this.addSimilarArtistsTopTracks(topArtists[0]));
        //     }
        // return Promise.all(promises);
    }

    // NOTE: currently using US as country code
    addArtistTopTracks(artist) {
        return executeMethod(
            () => {
                return this.spotifyApi.getArtistTopTracks(artist.id, "US")
            })
            .then((res) => {
                // MAX returns 10 tracks
                if (this.isResponseBodyTracksValid(res)) {
                    this.addTracksToHashMap(res.body.tracks);
                }
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    // NOTE: no longer used because of rate limiting for spotifyApi
    addSimilarArtistsTopTracks(artist) {
        return executeMethod(
            () => {
                return this.spotifyApi.getArtistRelatedArtists(artist.id)
            })
            .then((res) => {
                // MAX returns 20
                let promises = [];
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

    getAllAudioFeatures() {
        return this.addAllTracksToHashMap()
            .then(() => {
                if (!this.trackHashMap || this.trackHashMap.size === 0) throw new Err.EmptyTracksError();
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
                    if (audioFeatures && audioFeatures.body && audioFeatures.body["audio_features"]) {
                        audioFeatures = audioFeatures.body["audio_features"];
                        for (let audioFeature of audioFeatures) {
                            if (audioFeature !== null) {
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
                    }
                }
                return data;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    getAudioFeatures(tracks) {
        return executeMethod(
            () => {
                return this.spotifyApi.getAudioFeaturesForTracks(tracks)
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

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
                max_valence: 0.17
            }],
            fear: [{
                limit: 100,
                // seed_genres: "chill, sleep, acoustic, ambient",
                seed_tracks: "1egVLpTrGvaWtUcR2xDoaN,45Zo6ftGzq6wRckCUrMoBJ,7CZvsEFFZffXJ4HxLWtaQc,45Zo6ftGzq6wRckCUrMoBJ,688DZF6e1MH5Uf409dwaHm",
                target_valence: 0.5
            }], // same as neutral
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

        if (!this.mood) this.mood = "happiness"; //default mood
        let optionsArray = emotionToSeed[this.mood];
        for (let option of optionsArray) {
            promises.push(executeMethod(
                () => {
                    return this.spotifyApi.getRecommendations(option)
                }
            ));
        }
        return Promise.all(promises)
            .then((resArray) => {
                for (let res of resArray) {
                    if (this.isResponseBodyTracksValid(res)) {
                        let tracks = res.body.tracks;
                        this.addTracksToHashMap(tracks);
                    }
                }
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }


    getListOfUserPlaylistsIDs() {
        return executeMethod(() => {
            // todo: this is wrong need the userId of the user who we granted permission to
            return this.spotifyApi.getUserPlaylists()
        })
            .then((res) => {
                if (!this.isResponseBodyItemsValid(res)) return [];
                let playlistsIDs = [];
                for (let playlist of res.body.items) {
                    playlistsIDs.push(playlist.id);
                }
                return playlistsIDs;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }


    addUserPlaylistsTracks() {
        let NUM_TRACKS_FOR_EACH_PLAYLIST = 100;
        return this.getListOfUserPlaylistsIDs()
            .then((playlistIDs) => {
                if (!playlistIDs || !Array.isArray(playlistIDs) || playlistIDs.length === 0) return false;
                let promises = [];
                let numSongs = Math.floor(NUM_TRACKS_FOR_EACH_PLAYLIST / playlistIDs.length);
                for (let id of playlistIDs) {
                    promises.push(executeMethod(() => {
                        return this.spotifyApi.getPlaylistTracks(id, {limit: numSongs})
                    }));
                }

                return Promise.all(promises);
            })
            .then((res) => {
                let numPlaylists = res.length;
                let tracks = [];
                for (let i = 0; i < numPlaylists; i++) {
                    if (this.isResponseBodyItemsValid(res[i])) {
                        for (let track of res[i].body.items) {
                            tracks.push(track.track);
                        }
                    }
                }
                this.addTracksToHashMap(tracks);
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }


    // returns name, email, URL, and image of user
    getUserInfo() {
        return executeMethod(() => {
            return this.spotifyApi.getMe()
        })
            .then((res) => {
                let json = {};
                json.display_name = res.body.display_name;
                json.email = res.body.email;
                json.external_urls = res.body.external_urls;
                json.images = res.body.images;
                json.id = res.body.id;
                return json;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    // NOTE: this will create duplicate playlist if playlist already exists, there is no way to delete a playlist through Spotify API
    // since deleting a playlist will only make the owner unfollow it, while others can still follow the "deleted" playlist
    createNewPlaylist() {
        return this.getUserInfo()
            .then((result) => {
                if (result && result.id && this.mood) {
                    let userId = result.id;
                    return executeMethod(() => {
                            return this.spotifyApi.createPlaylist(userId, 'Flow Playlist: ' + this.mood, {public: false})
                        }
                    );
                } else {
                    throw new Err.InvalidResponseError("No user info or mood is currently not set");
                }
            }).catch((err) => {
                console.log(err);
                throw err;
            });
    }

    getNewPlaylist(trackURLs) {
        let link = null;
        if (!this.isTrackURLsValid(trackURLs)) return Promise.reject(new Err.InvalidInputError("trackURLs is invalid, ensure is a non-empty array"));
        return this.createNewPlaylist()
            .then((playlist) => {
                if (this.isCreatedPlaylistValid(playlist)) {
                    link = playlist.body.external_urls.spotify;
                    return executeMethod(() => {
                        return this.spotifyApi.addTracksToPlaylist(playlist.body.id, trackURLs)
                    });
                } else {
                    throw new Err.InvalidResponseError("Playlist was not created correctly");
                }
            })
            .then((result) => {
                if (!link || (result.statusCode !== 200 && result.statusCode !== 201)) throw new Err.InvalidResponseError("Playlist link is null or tracks were not added correctly");
                return link;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    isCreatedPlaylistValid(playlist) {
        return playlist && playlist.body && (playlist.statusCode === 200 || playlist.statusCode === 201) && playlist.body.external_urls && playlist.body.external_urls.spotify && playlist.body.id;
    }

    isTrackURLsValid(trackURLs) {
        return trackURLs && Array.isArray(trackURLs) && trackURLs.length !== 0;
    }
}

module.exports.SpotifyService = SpotifyService;