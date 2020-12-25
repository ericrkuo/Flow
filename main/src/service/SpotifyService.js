const Err = require("../constant/Error");
const {executeMethod} = require("./SpotifyApiWrapper");

class SpotifyService {

    /**
     * Constructor for spotifyService class
     * Default mood is happiness
     *
     * addRecentlyPlayedTracks()  - 50
     * addTopTracks()             - 100
     * addSavedTracks()           - 150
     * addTopArtistTracks()       - 200
     * addSeedTracks()            - 100
     * addUserPlaylistsTracks     - 100
     * addAllTracksToHashMap()
     * getAllAudioFeatures() - adds all tracks to hashmap and gets all the audio features
     *
     * @param spotifyApi - current instance of spotifyApi
     */
    constructor(spotifyApi) {
        this.spotifyApi = spotifyApi;
        this.trackHashMap = new Map();
        this.mood = "happiness";
    }

    /**
     * Sample function used to test validity of credentials
     * @returns {Promise<T|*|undefined>}
     */
    sampleFunction() {
        return executeMethod( () => {
            return this.spotifyApi.getArtistAlbums("43ZHCT0cAZBISjO8DG9PnE");
        });
    }

    /**
     * Adds all recently played, top, saved, seed, top artist, and user playlists tracks to map
     * @returns boolean - true upon successful addition
     */
    addAllTracksToHashMap() {
        const promises = [];
        promises.push(this.addRecentlyPlayedTracks());
        promises.push(this.addTopTracks());
        promises.push(this.addSavedTracks());
        promises.push(this.addSeedTracks());
        promises.push(this.addTopArtistsTracks());
        promises.push(this.addUserPlaylistsTracks());
        return Promise.all(promises)
            .then(() => {
                console.log("SUCCESS - added all " + this.trackHashMap.size + " tracks to hashmap");
                return true;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    /**
     * Adds current set of tracks to hashmap
     * @param tracks - current set of tracks
     */
    addTracksToHashMap(tracks) {
        if (!tracks || tracks.length === 0 || !Array.isArray(tracks)) {
            console.log("tracks is empty or null");
            return;
        }
        for (const track of tracks) {
            this.trackHashMap.set(track["id"], track);
        }
    }

    /**
     * Determines if response body items is valid
     * @param res - response body
     * @returns boolean - returns true if response, body, and items are all not null/undefined
     */
    isResponseBodyItemsValid(res) {
        return res && res.body && res.body.items;
    }

    /**
     * Determines if response body tracks is valid
     * @param res - response body
     * @returns boolean - returns true if response, body, and tracks are all not null/undefined
     */
    isResponseBodyTracksValid(res) {
        return res && res.body && res.body.tracks;
    }

    /**
     * Adds recently played tracks
     * If song X was listened to 10 times, it will return the song 10 times in the array
     * @returns boolean - true if tracks were successfully added
     */
    addRecentlyPlayedTracks() {
        return executeMethod(
            () => {
                return this.spotifyApi.getMyRecentlyPlayedTracks({limit: 50});
            })
            .then((res) => {
                if (!this.isResponseBodyItemsValid(res)) return false;
                const tracks = [];
                for (const item of res.body.items) {
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

    /**
     * Adds top tracks
     * @returns boolean - true if tracks were successfully added
     */
    addTopTracks() {
        const options = [{limit: 50}, {limit: 50, offset: 49}];
        const promises = [];
        for (const option of options) {
            promises.push(executeMethod(
                () => {
                    return this.spotifyApi.getMyTopTracks(option);
                },
            ));
        }
        return Promise.all(promises)
            .then((topTracksArray) => {
                if (!topTracksArray) return false;
                for (const topTracks of topTracksArray) {
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

    /**
     * Adds saved tracks
     * @returns boolean - true if tracks were successfully added
     */
    addSavedTracks() {
        const options = [{limit: 50}, {limit: 50, offset: 50}, {limit: 50, offset: 100}];
        const promises = [];
        for (const option of options) {
            promises.push(executeMethod(
                () => {
                    return this.spotifyApi.getMySavedTracks(option);
                },
            ));
        }
        return Promise.all(promises)
            .then((savedTracksArray) => {
                if (!savedTracksArray) return false;
                for (const savedTracks of savedTracksArray) {
                    if (!this.isResponseBodyItemsValid(savedTracks)) return false;
                    const tracks = [];
                    for (const item of savedTracks.body.items) {
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

    /**
     * Adds top artists tracks
     * @returns boolean - true if tracks were successfully added
     */
    addTopArtistsTracks() {
        return executeMethod(
            () => {
                return this.spotifyApi.getMyTopArtists({limit: 20, time_range: "long_term"});
            },
        )
            .then((res) => {
                const promises = [];
                if (!this.isResponseBodyItemsValid(res)) return false;
                for (const item of res.body.items) {
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

    /**
     * Adds artist top tracks
     * Currently using US for country code
     * @returns boolean - true if tracks were successfully added
     */
    addArtistTopTracks(artist) {
        return executeMethod(
            () => {
                return this.spotifyApi.getArtistTopTracks(artist.id, "US");
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

    /**
     * Adds similar artists tracks
     * Not currently being used because of rate limiting for spotifyApi
     * @returns boolean - true if tracks were successfully added
     */
    addSimilarArtistsTopTracks(artist) {
        return executeMethod(
            () => {
                return this.spotifyApi.getArtistRelatedArtists(artist.id);
            })
            .then((res) => {
                // MAX returns 20
                const promises = [];
                const similarArtists = res.body.artists;
                const n = Math.min(similarArtists.length, 1);
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

    /**
     * Gets all the audio features for all the tracks
     * @returns {Promise<{} | void>}
     */
    getAllAudioFeatures() {
        return this.addAllTracksToHashMap()
            .then(() => {
                if (!this.trackHashMap || this.trackHashMap.size === 0) throw new Err.EmptyTracksError();
                // get array of array of ids (split into 100)
                const promises = [];
                const trackIDS = Array.from(this.trackHashMap.keys());

                while (trackIDS.length !== 0) {
                    // getAudioFeatures has max of 100
                    const subsetOfTrackIDS = trackIDS.splice(0, 100);
                    promises.push(this.getAudioFeatures(subsetOfTrackIDS));
                }
                return Promise.all(promises);
                // return res[] of all the audio features
            }).then((res) => {
                // then create json objects with {"id" : {"Acoustic": 0.35, "Danceability":0.96, ...}, "id" : {...} }
                const data = {};
                const loudMIN = -60;
                const loudMAX = 0;
                const tempoMIN = 0;
                const tempoMAX = 250; // TODO: maybe disclude tempoMAX because dont know strict upper bound
                for (let audioFeatures of res) {
                    if (audioFeatures && audioFeatures.body && audioFeatures.body["audio_features"]) {
                        audioFeatures = audioFeatures.body["audio_features"];
                        for (const audioFeature of audioFeatures) {
                            if (audioFeature !== null) {
                                const id = audioFeature.id;
                                data[id] = {
                                    "danceability": audioFeature.danceability,
                                    "energy": audioFeature.energy,
                                    "loudness": (audioFeature.loudness - loudMIN) / (loudMAX - loudMIN),
                                    "speechiness": audioFeature.speechiness,
                                    "acousticness": audioFeature.acousticness,
                                    "instrumentalness": audioFeature.instrumentalness,
                                    "liveness": audioFeature.liveness,
                                    "valence": audioFeature.valence,
                                    "tempo": (audioFeature.tempo - tempoMIN) / (tempoMAX - tempoMIN),
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

    /**
     * Gets the audio features for a specific set of tracks
     * @param tracks - current tracks
     * @returns {Promise<T | * | undefined | void>}
     */
    getAudioFeatures(tracks) {
        return executeMethod(
            () => {
                return this.spotifyApi.getAudioFeaturesForTracks(tracks);
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    /**
     * Gets recommendations based on seeds (browse)
     *   - browse by genres (happy,sad) https://developer.spotify.com/console/get-available-genre-seeds/
     *   - put in seed tracks and seed artists for more recommendations (personalized to user)
     *   - NOTE** only 5 seeds max total
     * get 50 happy, 50 sad, 50 chill, 50 ambient,  50 for top 5 artist, 50 for top 5 track
     * @returns boolean - returns true if seed tracks were successfully added
     */
    addSeedTracks() {
        const promises = [];
        // let optionsArray = [
        //     {limit: 100, seed_genres: "sad"},
        //     // {limit: 100, seed_genres: "chill, ambient"},
        //     {limit: 100, seed_genres: "happy"},
        //     {limit: 100, seed_genres: "chill"}
        //
        // ];
        const emotionToSeed = {
            anger: [{
                limit: 100,
                // seed_genres: "hardcore, heavy-metal, death-metal, hard-rock, punk",
                seed_genres: "death-metal, punk",
                seed_tracks: "2vwlzO0Qp8kfEtzTsCXfyE,3xrn9i8zhNZsTtcoWgQEAd,7K5dzhGda2vRTaAWYI3hrb",
                max_valence: 0.15,
            }],
            contempt: [{
                limit: 100,
                seed_genres: "death-metal, hardcore",
                seed_tracks: "2vwlzO0Qp8kfEtzTsCXfyE,1KGi9sZVMeszgZOWivFpxs,5vTPxzm4h2bY9rYyVrGEU5",
            }], // described as combo of disgust + anger
            disgust: [{
                limit: 100,
                seed_genres: "heavy-metal, hardcore",
                seed_tracks: "1KGi9sZVMeszgZOWivFpxs,5vTPxzm4h2bY9rYyVrGEU5,6rUp7v3l8yC4TKxAAR5Bmx,",
                max_valence: 0.17,
            }],
            fear: [{
                limit: 100,
                // seed_genres: "chill, sleep, acoustic, ambient",
                seed_tracks: "1egVLpTrGvaWtUcR2xDoaN,45Zo6ftGzq6wRckCUrMoBJ,7CZvsEFFZffXJ4HxLWtaQc,45Zo6ftGzq6wRckCUrMoBJ,688DZF6e1MH5Uf409dwaHm",
                target_valence: 0.5,
            }], // same as neutral
            happiness: [{
                limit: 100,
                seed_genres: "happy, hip-hop, summer, pop, party",
                min_energy: 0.8,
                min_valence: 0.8,
            }],
            neutral: [{limit: 100, seed_genres: "chill, sleep, acoustic, ambient", target_valence: 0.5}],
            sadness: [{limit: 100, seed_genres: "sad, blues, rainy-day, r-n-b", max_energy: 0.3, max_valence: 0.3}],
            surprise: [{limit: 100, seed_genres: "hardstyle, work-out, edm, party"}],
        };

        if (!this.mood) this.mood = "happiness"; //default mood
        const optionsArray = emotionToSeed[this.mood];
        for (const option of optionsArray) {
            promises.push(executeMethod(
                () => {
                    return this.spotifyApi.getRecommendations(option);
                },
            ));
        }
        return Promise.all(promises)
            .then((resArray) => {
                for (const res of resArray) {
                    if (this.isResponseBodyTracksValid(res)) {
                        const tracks = res.body.tracks;
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


    /**
     * Gets a list of playlist IDs for current user
     * @returns {Promise<string[]>}
     */
    getListOfUserPlaylistsIDs() {
        return executeMethod(() => {
            // todo: this is wrong need the userId of the user who we granted permission to
            return this.spotifyApi.getUserPlaylists();
        })
            .then((res) => {
                if (!this.isResponseBodyItemsValid(res)) return [];
                const playlistsIDs = [];
                for (const playlist of res.body.items) {
                    playlistsIDs.push(playlist.id);
                }
                return playlistsIDs;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    /**
     * Adds user playlists tracks
     * @returns boolean - returns true if user playlists tracks were successfully added
     */
    addUserPlaylistsTracks() {
        const NUM_TRACKS_FOR_EACH_PLAYLIST = 100;
        return this.getListOfUserPlaylistsIDs()
            .then((playlistIDs) => {
                if (!playlistIDs || !Array.isArray(playlistIDs) || playlistIDs.length === 0) return false;
                const promises = [];
                const numSongs = Math.floor(NUM_TRACKS_FOR_EACH_PLAYLIST / playlistIDs.length);
                for (const id of playlistIDs) {
                    promises.push(executeMethod(() => {
                        return this.spotifyApi.getPlaylistTracks(id, {limit: numSongs});
                    }));
                }

                return Promise.all(promises);
            })
            .then((res) => {
                const numPlaylists = res.length;
                const tracks = [];
                for (let i = 0; i < numPlaylists; i++) {
                    if (this.isResponseBodyItemsValid(res[i])) {
                        for (const track of res[i].body.items) {
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

    /**
     * Returns information about current Spotify user
     * @returns JSON - name, email, URL, image of user
     */
    getUserInfo() {
        return executeMethod(() => {
            return this.spotifyApi.getMe();
        })
            .then((res) => {
                const json = {};
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


    /**
     * Creates new playlist for current user
     * This will create duplicate playlist if playlist already exists, there is no way to delete a playlist through Spotify API
     * since deleting a playlist will only make the owner unfollow it, while others can still follow the "deleted" playlist
     * @returns {Promise<T>}
     */
    createNewPlaylist() {
        return this.getUserInfo()
            .then((result) => {
                if (result && result.id && this.mood) {
                    const userId = result.id;
                    return executeMethod(() => {
                        return this.spotifyApi.createPlaylist(userId, "Flow Playlist: " + this.mood, {public: false});
                    },
                    );
                } else {
                    throw new Err.InvalidResponseError("no user info or mood is currently not set");
                }
            }).catch((err) => {
                console.log(err);
                throw err;
            });
    }

    /**
     * Creates a new playlist based on list of track URLs
     * @param trackURLs - list of track URLs
     * @returns {Promise<T>}
     */
    getNewPlaylist(trackURLs) {
        let link = null;
        if (!this.isTrackURLsValid(trackURLs)) return Promise.reject(new Err.InvalidInputError("trackURLs is invalid, ensure is a non-empty array"));
        return this.createNewPlaylist()
            .then((playlist) => {
                if (this.isCreatedPlaylistValid(playlist)) {
                    link = playlist.body.external_urls.spotify;
                    return executeMethod(() => {
                        return this.spotifyApi.addTracksToPlaylist(playlist.body.id, trackURLs);
                    });
                } else {
                    throw new Err.InvalidResponseError("playlist did not create correctly");
                }
            })
            .then((result) => {
                if (!link || result.statusCode !== 200 && result.statusCode !== 201) throw new Err.InvalidResponseError("link is null or tracks did not add correctly");
                return link;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            });
    }

    /**
     * Checks if created playlist is valid
     * @param playlist - current playlist generated
     * @returns boolean - returns true if created playlist, body and items are not null/undefined, status codes are successful
     */
    isCreatedPlaylistValid(playlist) {
        return playlist && playlist.body && (playlist.statusCode === 200 || playlist.statusCode === 201) && playlist.body.external_urls && playlist.body.external_urls.spotify && playlist.body.id;
    }

    /**
     * Checks if track URLs are valid
     * @param trackURLs - current list of track URLs
     * @returns boolean - returns true if trackURLs are not null/undefined/size zero, and in the format of an array
     */
    isTrackURLsValid(trackURLs) {
        return trackURLs && Array.isArray(trackURLs) && trackURLs.length !== 0;
    }
}

module.exports.SpotifyService = SpotifyService;