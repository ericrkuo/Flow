const SpotifyWebApi = require('spotify-web-api-node');

let trackHashMap;

class Spotify {
    // TODO: turn add___ functions into get___ and then use universal add(get___));
    // TODO: figure out why can do this.spotifyApi even tho did not declare it anywhere outside
    constructor() {
        require('dotenv').config();
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        this.spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        // this.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        trackHashMap = new Map();
    }

    sampleFunction() {
        return this.spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE');
    }

    // get recent history objects
    // TODO: can get maybe like 250, each time changing index by 50 if dataSet of artists not enough
    addRecentlyPlayedTracks() {
        return this.spotifyApi.getMyRecentlyPlayedTracks({limit: 50})
            .then((res) => {
                this.addHistoryObjectTracksToHashMap(res.body.items);
                let x = trackHashMap;
                return JSON.stringify(res.body.items, null, '  ');
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    }

    addHistoryObjectTracksToHashMap(historyObjects) {
        for (let historyObject of historyObjects) {
            let track = historyObject["track"];
            trackHashMap.set(track["id"], track);
        }
    }

    // TODO: can get maybe like 250, each time changing index by 50 if dataSet of artists not enough
    addTopTracks() {
        return this.spotifyApi.getMyTopTracks({limit: 50})
            .then((res) => {
                this.addTracksToHashMap(res.body.items);
                let x = trackHashMap;
                return JSON.stringify(res.body.items, null, '  ');
            })
            .catch((err) => {
                console.log(err);
                return err;
            });
    }


    addTracksToHashMap(tracks) {
        for (let track of tracks) {
            trackHashMap.set(track["id"], track);
        }
    }

    // TODO: has offest, so can get more than 50 possibly
    // TODO: handle cases of no saved tracks
    addSavedTracks() {
        return this.spotifyApi.getMySavedTracks({limit: 50})
            .then((res) => {
                let arr = [];
                for (let item of res.body.items) arr.push(item.track);
                this.addTracksToHashMap(arr);
                let x = trackHashMap;
                return JSON.stringify(arr, null, ' ');
            }).catch((err) => {
                console.log(err);
                return err;
            });
    }

    addTopArtistsTracks() {
        let promises = [];
        let topArtists;

        return this.spotifyApi.getMyTopArtists({limit: 50, time_range: "long_term"})
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
                let x = trackHashMap;
                console.log("HERE");
            })
            .catch((err) => {
                console.log(err);
                return err;
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
                return err;
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
                return err;
            });
    }

    getSampleDataToWorkWith() {
        return this.addTopArtistsTracks()
            .then(() => {
                // get array of array of ids (split into 100)
                let promises = [];
                let trackIDS = Array.from(trackHashMap.keys());

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
            })
            .catch((err) => {
                console.log(err);
                return err;
            })
    }

    getAudioFeatures(tracks) {
        return this.spotifyApi.getAudioFeaturesForTracks(tracks);
    }

    // TODO: get users saved albums and the tracks inside those albums
    // TODO: get tracks from playlist (maybe not)
    // TODO: need more VARIETY of tracks of different emotions
    /*
    * get recommendations based on seeds (browse)
    *   - browse by genres (happy,sad) https://developer.spotify.com/console/get-available-genre-seeds/
    *   - put in seed tracks and seed artists for more recommendations (personalized to user)
    *   - NOTE** only 5 seeds max total
    * get 50 happy, 50 sad, 50 chill, 50 ambient,  50 for top 5 artist, 50 for top 5 track
    * */

}

module.exports.Spotify = Spotify;