const SpotifyWebApi = require('spotify-web-api-node');

class Emotion {

    /* PLAN: Find the emotion with largest value possible.
    * -> (MATCHING OR OPPOSITE) ANGER plays aggressive, harsh music or neutral's
    * -> CONTEMPT plays ???
    * -> DISGUST plays ???
    * -> (OPPOSITE) FEAR plays calm, ambient music
    * -> (MATCHING OR OPPOSITE) HAPPY plays happy music or sad's
    * -> (MATCHING OR OPPOSITE) NEUTRAL plays calm, ambient music or anger's
    * -> (MATCHING OR OPPOSITE) SADNESS plays sad music or happy's
    * -> SURPRISE plays ???
    *
    *
    * */

    emotionMap = {
        anger: [],
        contempt: [],
        disgust: [],
        fear: [],
        happiness: [
            "2Vi0fxL1fyE7KrKt3JihJn",
            "1FSWSs9CL01RCYxXtm08Rf",
            "2UVLuddklEVak5PXgC7baA",
            "5lA3pwMkBdd24StM90QrNR",
            "0Ph6L4l8dYUuXFmb71Ajnd",
            "4hGOhC87bn7JBdYykOJJvJ",
            "1gihuPhrLraKYrJMAEONyc",
            "0AkQbXGN4KG34TS7xLrM68",
            "1XkUmKLbm1tzVtrkdj2Ou8",
            "4jOtC832PyIXlCVPRElfQu",
            "714hERk9U1W8FMYkoC83CO",
            "1EzaEQ1hUWj7NWphY5Allw",
            "15HadeuRG9THazDGzLH8ZU",
            "5KL4iZkCTZyXl7KnHgfVDj",
            "4675yUu8AUbE72T94BkLCD",
            "0qi4b1l0eT3jpzeNHeFXDT",
            "5RBx3tM9hmVJAOnSUHIWkn",
            "4bk78jvK8Fe9YHqruOJW0v",
            "2PBOI7vYicqDaG9rYbycUO",
            "7KkzVlps826NezcpXPvEuV",
            "4At8zIlntcZaPorwdI69km",
            "6NGet2NFndj4XvpjH9iMvb",
            "0LAfANg75hYiV1IAEP3vY6",
            "23JZO56H9BEYQqedJSiDxZ",
            "3i3GeK0qLQybu4ah42YmCY",
            "2SwkHQpyK3Tq11RtJjQhJY",
            "3U3BXlwNTkCx7lW9m1H9RY",
            "717TY4sfgKQm4kFbYQIzgo",
            "1BXO5XG7ctHzjzpRRKlWZd",
            "6nzhhT57iQYrbqumru9NNP",
            "7w87IxuO7BDcJ3YUqCyMTT",
            "7kz6GbFr2MCI7PgXJOdq8c",
            "5lA6mFOvaiienokVbTZEQx",
            "386RUes7n1uM1yfzgeUuwp",
            "0GrrLYCH8u81aENhC8FBF4",
            "1qEHgdFqUxFebMPk8s2HLY",
            "7vIBxqsNQZ3PehEFQr1ZGt",
            "3mcG2NI5G5vhrQtRda1YnA",
            "7n9Q6bXSjm74uCtajkddPt",
            "42loEE51UDcecom9K8K4ei",
            "0D7L4pBEGv8ni1cRfaTdMJ",
            "74reD6Vha9tSy1ReFmyW40",
            "3LmpQiFNgFCnvAnhhvKUyI",
            "2UH4rbT5WrO2sDCanZI0vX",
            "4c6vZqYHFur11FbWATIJ9P",
            "2dzMbi6uW2EE4cgzxf8vcO",
            "2kyBz2bXWUQDL26Aigex0X",
            "368S2jjTfDk9Hk9x9YDzwj",
            "5WLhAmEGwePI2RD9ZECTw7",
            "0ifSeVGUr7py5GggttDhXw",
            "1dKm4a7TOYFzzTQvU59C59",
            "1CSLeVCXmetBh8IkTPMFdL",
            "5M5mzimlah21xlC1rAuIuY",
            "4nqHBebJbARDVzQ0urbzX0",
            "3AszgPDZd9q0DpDFt4HFBy",
            "5nNmj1cLH3r4aA4XDJ2bgY",
            "6Ac4NVYYl2U73QiTt11ZKd",
            "1fP3xQfPA2vPybTzyjweHJ",
            "3kb72STxc2959ZqsTwu52i",
            "7JoHtWZSie5aSbhVasDNEP",
            "2JvClsYrYfLz76Td6J9MPa",
            "6t0fYRoZlM5kQ9qT19JnbZ",
            "2qESkHBZ2VThboOnosYFBk",
            "60Ctoy2M8nmDaI7Fax3fTL",
            "3Y9xtYyVyF13po6xePV5Cp",
            "2Ml0l8YWJLQhPrRDLpQaDM",
            "5WSdMcWTKRdN1QYVJHJWxz",
            "27L8sESb3KR79asDUBu8nW",
            "6aGjEZ7kq3YXgD0EDt80O5",
            "11CeyEFt21BvAICfd4U8FA"
        ],
        neutral: [
            "2ihCaVdNZmnHZWt0fvAM7B",
            "2lFTzUnuGaWlWHJQokjRyb",
            "2JFmTONwQdRaOj2s2DhFah",
            "2UKYMN7VnsQo40n0qCt6Sa",
            "4o0NjemqhmsYLIMwlcosvW",
            "5snyhxAh55A2wlNRH7VVZJ",
            "5ULWOQncFghxDboleclsf7",
            "67Hna13dNDkZvBpTXRIaOJ",
            "7kSLdGdXLey7pzLsWpdg1h",
            "5eWOsyHHic4vJP3LjTVhqv",
            "0idc0XRnLRovVqpWnGQ6hC",
            "70y3OsCu7GBkJ3aqD94Agv",
            "249E7AgSyA4vhtXNEjQYb5",
            "4Li2WHPkuyCdtmokzW2007",
            "7zkLpY72g6lKQbiHDqri1S",
            "2QOMGq8wVTZbLmh7McrvgF",
            "27Ge0bPmJb6ZBPEXM4pmMZ",
            "0xM88xobymkMgg46MStfnV",
            "05pKAafT85jeeNhZ6kq7HT",
            "7wMq5n8mYSKlQIGECKUgTX",
            "4oeRfmp9XpKWym6YD1WvBP",
            "1x8AFBt9UEMRY41fSxi7aA",
            "05lBuZWQ2OhQuzoCSIkvUF",
            "1zuKjpp4t7BS8JPKi6mkQr",
            "1qfYG2JrchEyJiqKnkE7YQ",
            "3l5GdoaOPPVWRjIgbTBejJ",
            "1Hs085AOaoXrknVZExcE80",
            "3JvKfv6T31zO0ini8iNItO",
            "0mBkoM8r7KAQzZij5swTUL",
            "1mKXFLRA179hdOWQBwUk9e",
            "7Fw5i56my24ZBnGS7hFX2n",
            "3Otjx9ULpmWdUbkDTYDXHc",
            "5wQeCrJTJxGZnILnyCBHjI",
            "7J4gq1xNP3IsG6lDk0eSa7",
            "6t6oULCRS6hnI7rm0h5gwl",
            "6ybViy2qrO9sIi41EgRJgx",
            "2M9ro2krNb7nr7HSprkEgo",
            "6vODhpvfWwdsO0i9MBWnEq",
            "5IyblF777jLZj1vGHG2UD3",
            "75JFxkI2RXiU7L9VXzMkle",
            "30BsewEJZPxfuLNAlZPFje",
            "5nWbbQ0sIEabqPxAdqmh66",
            "4T8AdShKNGD6mZqEyLM1nz",
            "1mwt9hzaH7idmC5UCoOUkz",
            "4Y2W4zKa3q72ztbkA0r8Va",
            "3WS7spXVlbeC5kjePmHMQW",
            "3pD0f7hSJg2XdQ6udw5Tey",
            "14rApQTKycs9gNg7hjm9m7",
            "4DbmuOSxftTmltXNebpvl7",
            "2ZaYFNn1YQuLSVdHhanr4Q",
            "0d28khcov6AiegSCpG5TuT",
            "0Tel1fmuCxEFV6wBLXsEdk",
            "6ORqU0bHbVCRjXm9AjyHyZ",
            "6rxEjkoar48SssZePbtb2x",
            "5j82yGNCjpk6R50LgR4hHG",
            "1EZJBB6bvCcrvYRlOyoHuf",
            "1A2UmLDZzDmpdzUjEkCc3z",
            "5gf6t8j49qayhwrnd05uLI",
            "50uGbeaQIxKiSc7jvRTjWx",
            "4o8YocVCmZZimcqyY1Z5rO",
            "3xFvgh4mvJvBH2tf1tFJYl",
            "5HQVUIKwCEXpe7JIHyY734",
            "1EzrEOXmMH3G43AXT1y7pA",
            "4dHEQ1W1jRmNjjB0S7vB8V",
            "33e9HtOfO1ye1h8xQ7Foc9",
            "0ntQJM78wzOLVeCUAW7Y45",
            "1HyBdd35ssTpPU4Lytz7BI",
            "1zQX8Tf3fRYw8Djxh5kUKq",
            "3HfB5hBU0dmBt8T0iCmH42",
            "20S0KRq4z2v2Utym0C246s",
            "0Zw4llKeB35SIKASy1aLtV",
            "336ZYcU6poBWi3s8yzRcAD",
            "6b5rA9rthDbZDOQp9UbOgl",
            "6PcuC1LuoldUcOGegswbQp",
            "2RTAaSdjuoaJflDn3YKlls",
            "1wAXODAAL6hY64ZdhrnjBO",
            "47hs3xNT3iOGvgmC4eXBAi",
            "6jdOi5U5LBzQrc4c1VT983",
            "3y540Z9QFePg2CyZYWZMyI",
            "3MdYFBIzPf7lSJnI8wi3Ka",
            "4J8WVHRtXM6SMgsF7qohXy",
            "7vFv0yFGMJW3qVXbAd9BK9",
            "4Musyaro0NM5Awx8b5c627",
            "2yFh7Oz9g0bpHp3iis2Iu2",
            "5oUV6yWdDM0R9Q2CizRhIt",
            "1y4Kln6VEjQMpmHW7j9GeY",
            "5VFzIzR8nACf9Bad4O73f6",
            "0Xy9xPPs2zRRFqljGqKXel",
            "4IoYz8XqqdowINzfRrFnhi",
            "6nmVeODcBpsGKx5RPv003D",
            "7jqzZyJJLrpkRFYGpkqSK6",
            "38xWaVFKaxZlMFvzNff2aW",
            "5x86JP3jRMHIowmgZlhTRX",
            "3ZffCQKLFLUvYM59XKLbVm",
            "3SktMqZmo3M9zbB7oKMIF7",
            "5U8hKxSaDXB8cVeLFQjvwx",
            "5HkUwvLeE5Lhd2FZjuXncU",
            "5Fli1xRi01bvCjsZvKWro0",
            "6nVEdIiB3h5b2TbQhFnQUk",
            "4BDpHt1JrVQzaU7E6RBbXh"
        ],
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


    getDominantExpression(emotionsData) {
        let emotions = ["anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"];

        let emotionData = emotionsData[0]["faceAttributes"]["emotion"];

        let dominantEmotion = null;
        let dominantEmotionValue = -1;

        for (let i = 0; i < emotions.length; i++) {
            let currEmotion = emotions[i];
            let currEmotionValue = emotionData[currEmotion];

            if (currEmotionValue > dominantEmotionValue) {
                dominantEmotion = currEmotion;
                dominantEmotionValue = currEmotionValue;
            }

        }

        return dominantEmotion;
    }
}

module.exports.Emotion = Emotion;