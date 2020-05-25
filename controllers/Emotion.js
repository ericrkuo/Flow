const SpotifyWebApi = require('spotify-web-api-node');

class Emotion {

    emotionMap = {
        anger: [],
        contempt: [],
        disgust: [],
        fear: [],
        happiness: [],
        neutral: [],
        sadness: ["3l5GdoaOPPVWRjIgbTBejJ", "6oDPg7fXW3Ug3KmbafrXzA", "3YiM2jGwWrWRxyTTllIuhd", "3XVBdLihbNbxUwZosxcGuJ", "63xBKQr7HJkKaSyhwEWCnE", "7kSLdGdXLey7pzLsWpdg1h", "1EFddFVisHbqCHah6oBlhD", "7jqzZyJJLrpkRFYGpkqSK6", "3iGjPHGVRKPgQ6LvSN2zJI", "30Co9eN7JHPf1i2wEyVSMJ", "3B7udSGy2PfgoCniMSb523", "519uJbE3zyKLlToVA65PrP", "0mUyMawtxj1CJ76kn9gIZK", "4umQEKp1NQBzbk8k4egK7p", "7o9AYzTQfykIJ6HUt7FT0v", "2dBwB667LHQkLhdYlwLUZK", "4T2SmVJPtDdugk5j5xV1d5", "47ZWr1Nb0PUgmKgyg5JkgO", "05pKAafT85jeeNhZ6kq7HT", "5A2mJ5TGOBWTtYNGf4sLO0", "1JCCdiru7fhstOIF4N7WJC", "3wsZYuHJrk3lssa7V7jvye", "0SuG9kyzGRpDqrCWtgD6Lq", "142rTdgKhe55q9LdSU4cYF", "6RX5iL93VZ5fKmyvNXvF1r", "0fQlm2MUzqGDBPkuqq4U1Y", "1mea3bSkSGXuIRvnydlB5b", "1jF7IL57ayN4Ity3jQqGu0", "5UQGObp0GyFOEnza3RZLX8", "49kjlZP49LMD1MrrcvXDET", "4IoYz8XqqdowINzfRrFnhi", "2nMeu6UenVvwUktBCpLMK9", "4BXkf6yww23Vdju7E1fUrn", "7sapKrjDij2fpDVj0GxP66", "4RC5YmcpCbRsX3AtRzoQeh", "6FvSJjsxM3o5ctpexdB31e", "5OiaAaIMYlCZONyDBxqk4G", "0cWPe8mPRyLMxxe94eRVzs", "3kZC0ZmFWrEHdUCmUqlvgZ", "5r55eZvOijyYZRPCdQbu85", "4E0lSJ6c5unoku9UIZoJSl", "26658g5gaViKD0e3UYAqPE", "4kbz7rHVbyjKasuuqelccQ", "2JFEZO2ZxzffY0wd9MYEu3", "3U4isOIWM3VvDubwSI3y7a", "7gpy7sfWPNuOKmUNs3XQYE", "6JUALLwHnidbO4eM09ArIh", "4Musyaro0NM5Awx8b5c627", "1UmFRZU3taMGZApPhK32mc", "29i8axWOLDmgbiutJb9prB", "24lMtPOCzP5g4hrg3NklLa", "0vg4WnUWvze6pBOJDTq99k", "3goSVuTt3fDYDP6kRnFwuL", "3n9mzjgAzjyKawvbHzciXF", "4YjjNHtEsTX6Af4mCTupT5", "3PHYPaguCDKLK1a9cp3uXZ", "0nJW01T7XtvILxQgC5J7Wh", "2Y115i0IhELJhyyftvoSFt", "0rpIH5otu7ykvZPdcQuRPh", "3cdhgO3vgHyOIADMXokd2t", "4eHbdreAnSOrDDsFfc4Fpm", "6z5Yh7kOKeLjqIsNdokIpU", "2rJWnAqSuLMls0KOv416Io", "0GgN4MhR5GKn5IcKN0e0rG", "5JDcQAztvZTIkrWoZihgvC", "5dhQCqONiQji7k4RkhIcjq", "42i1pGtSyPVXNX71oW8dyg", "3c9LVPh3MpeFoaAL5DBDK5", "2M9ro2krNb7nr7HSprkEgo", "5l6hpyTGBK0LAAxgPnqTQL", "3pj6SiBe8SB7Fw31MjtwuZ", "1EzrEOXmMH3G43AXT1y7pA", "4wFUdSCer8bdQsrp1M90sa", "0z9UVN8VBHJ9HdfYsOuuNf", "0fBSs3fRoh1yJcne77fdu9", "714Lw0m2SmCEhKSPw0Dn8J", "2OuNgtXKeCSORKqdl0MxKk", "2WmDlNSXpyYgMK0ws7ZWDa", "21JTgoZLDB2F4Fx0uRCmTL", "5LFtkeNjLpZAey3Arj3h4M", "7z0JcZ8PQoAfUaLIXvbyTH", "3HfB5hBU0dmBt8T0iCmH42", "3husjxyCMBvNeiTEcrpPSe", "1Hs085AOaoXrknVZExcE80", "7utRJ4BeYx85khzP3lKoBX", "05lBuZWQ2OhQuzoCSIkvUF", "3xZMPZQYETEn4hjor3TR1A", "58CrldAc1Z5WIBozT1NMJH", "6LtPIXlIzPOTF8vTecYjRe", "3LmvfNUQtglbTrydsdIqFU", "0hCW6LbmFCYwM1uGmnjjNe", "7m2Ny5RefrEnAyOtNujSlb", "0xM88xobymkMgg46MStfnV", "1HNkqx9Ahdgi1Ixy2xkKkL", "4tCWWnk3BXinf7FllmSyHW", "0UAB340gAcSMk3r0a8PTag", "4K41YQFFNY45aAZXzBb9Q3", "4B3RmT3cGvh8By3WY9pbIx", "101TaHCVkpOMmlQNjPKRQ5", "5NTA3dsB2DlLaSG1KM6RTh"],
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
            .then((res) => {
                let songFeatures = {};
                for (let feature of this.features) songFeatures[feature] = 0;
                for (let audioFeature of res.body["audio_features"]) {
                    for (let feature of this.features) {
                        songFeatures[feature] = songFeatures[feature] + audioFeature[feature];
                    }
                }
                for (let feature of this.features) {
                    songFeatures[feature] = songFeatures[feature] / numTracks;
                }

                let loudMIN = -60;
                let loudMAX = 0;
                let tempoMIN = 0;
                let tempoMAX = 250;
                songFeatures["loudness"] = (songFeatures["loudness"] - loudMIN) / (loudMAX - loudMIN);
                songFeatures["tempo"] = (songFeatures["tempo"] - tempoMIN) / (tempoMAX - tempoMIN);
                return songFeatures;
            })
            .catch((err) => {
                console.log(err);
                throw err;
            })
    }


}

module.exports.Emotion = Emotion;