const SpotifyWebApi = require('spotify-web-api-node');

class Emotion {

    emotionMap = {
        anger: [],
        contempt: [],
        disgust: [],
        fear: [],
        happiness: [],
        neutral: [],
        sadness: ["2QZ7WLBE8h2y1Y5Fb8RYbH", "0AS63m1wHv9n4VVRizK6Hc"],
        surprise: [],
    };
    

    constructor() {
        require('dotenv').config();
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        this.spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        // this.spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        this.features = ["danceability", "energy", "loudness", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo"];
    }
    
    getFeatures(mood) {
        let numTracks = this.emotionMap[mood].length;
        return this.spotifyApi.getAudioFeaturesForTracks(this.emotionMap[mood])
            .then((res)=> {
                let songFeatures = {};
                for(let feature of this.features) songFeatures[feature]=0;
                for(let audioFeature of res.body["audio_features"]) {
                    for (let feature of this.features) {
                        songFeatures[feature] = songFeatures[feature] + audioFeature[feature];
                    }
                }
                for (let feature of this.features) {
                    songFeatures[feature] = songFeatures[feature]/numTracks;
                }

                return songFeatures;
            })
            .catch((err)=> {
                console.log(err);
                return err;
            })
    }
    

}

module.exports.Emotion = Emotion;