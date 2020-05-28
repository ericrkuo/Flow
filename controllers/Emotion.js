const SpotifyWebApi = require('spotify-web-api-node');

class Emotion {

    emotionMap = {
        anger: [],
        contempt: [],
        disgust: [],
        fear: [],
        happiness: [
            "1xN7BpTAWnZkuSLOtRP6Qc",
            "3gNNXc7GUgKRPR15W77eDR",
            "766RKRQ1ZJjmdBQ9y54HKj",
            "6Ese4lZeXdyfQfaLuQH58A",
            "66S14BkJDxgkYxLl5DCqOz",
            "7wMq5n8mYSKlQIGECKUgTX",
            "7kzKAuUzOITUauHAhoMoxA",
            "4MJlgdrGLaayCTPtdn0kII",
            "6ZBJFWDYJSTQg54eDsqnkJ",
            "5G2c6FsfTzgYUzageCmfXY",
            "2yFh7Oz9g0bpHp3iis2Iu2",
            "0D2VYiRlBv43asKUgieZaM",
            "7hMqIrwysNlIXRmFCIn5j3",
            "1z6WtY7X4HQJvzxC4UgkSf",
            "4pGqFOfzvfe6avb9kbZicC",
            "5nWbbQ0sIEabqPxAdqmh66",
            "7b71WsDLb8gG0cSyDTFAEW",
            "0nypsuS2jtogLaJDcRQ4Ya",
            "1qfYG2JrchEyJiqKnkE7YQ",
            "6BtmXhTJMM9sBTHeYYASGz",
            "52a6VcF23v5HB7KfDEmBHq",
            "4lY95OMGb9WxP6IYut64ir",
            "0nmxH6IsSQVT1YEsCB9UMi",
            "25R6UFrB9DKhEWkNhOLe5u",
            "1olNHIIVl4EVwIEPGYIR7G",
            "1VdZ0vKfR5jneCmWIUAMxK",
            "444P4wvSDa0SD5HE4YGx9B",
            "0mBkoM8r7KAQzZij5swTUL",
            "1CNJyTUh56oj3OCZOZ5way",
            "2I43coEbzFSTMGO3kCjLMB",
            "44Ljlpy44mHvLJxcYUvTK0",
            "0fPf9CDFzVnHpcfld5XVtO",
            "3FtYbEfBqAlGO46NUDQSAt",
            "3ItzRpwvKtkDSNdRSjXu7Z",
            "12lZTPlXwUtrQuhEty6098",
            "2ia7iiEtpiOL2ZVuWxBZGB",
            "1Xsxp1SEOxuMzjrFZhtw8u",
            "2udw7RDkldLFIPG9WYdVtT",
            "0BhZWr9gPZNlVdWWigvYA9",
            "6oDPg7fXW3Ug3KmbafrXzA",
            "5HQVUIKwCEXpe7JIHyY734",
            "0PfcFWevZo1sB9N7C4akEK",
            "4G8gkOterJn0Ywt6uhqbhp",
            "0qcr5FMsEO85NAQjrlDRKo",
            "42et6fnHCw1HIPSrdPprMl",
            "0rFOs9paloAvEtzwDX1Kmc",
            "6vSq5q5DCs1IvwKIq53hj2",
            "2rJojRundKuKFgbvmCAYva",
            "5fnA9mkIfScSqHIpeDyvck",
            "2Oj5BXOY01EDuJhVYNlEoq",
            "0FeCO85RKW8fDRytwXof2x",
            "3NcO4jGK1Opb5ea0mYLpxb",
            "0KpfYajJVVGgQ32Dby7e9i",
            "10ViidwjGLCfVtGPfdcszR",
            "1YLJVmuzeM2YSUkCCaTNUB",
            "2dLLR6qlu5UJ5gk0dKz0h3",
            "7n3REqDfZBpkd0bEpGu2H3",
            "0O45fw2L5vsWpdsOdXwNAR",
            "11N58AwI4g2GlBaHEiZdmk",
            "4oeRfmp9XpKWym6YD1WvBP",
            "7pNC5ZIKtwUK0ReSpM3P9f",
            "1PmXm1881bonBI1AlG5uaH",
            "7ueP5u2qkdZbIPN2YA6LR0",
            "5j9iuo3tMmQIfnEEQOOjxh",
            "3kb38wezoUA8ki5jPYy3t5",
            "2Oehrcv4Kov0SuIgWyQY9e",
            "0qOnSQQF0yzuPWsXrQ9paz",
            "7w87IxuO7BDcJ3YUqCyMTT",
            "3AszgPDZd9q0DpDFt4HFBy",
            "7gKIt3rDGIMJDFVSPBnGmj",
            "0t2QiRkpag0fAgs9zuCPlH",
            "60wwxj6Dd9NJlirf84wr2c",
            "5dKBaysNJtfpyNTRa5lqDb",
            "1jyddn36UN4tVsJGtaJfem",
            "6jizk5lOUnfpaZXYMdfeC6",
            "7sMGwiS4vOMcz86ZY3vKYM",
            "2VhPOtIQw2UpQmRVevdviU",
            "0G5F2msfVO77xs7ql2RiTS",
            "06ngjaiEea4jvIcAIcxcGr",
            "5nNmj1cLH3r4aA4XDJ2bgY",
            "7Fw5i56my24ZBnGS7hFX2n",
            "2ihCaVdNZmnHZWt0fvAM7B",
            "2qESkHBZ2VThboOnosYFBk",
            "24lMtPOCzP5g4hrg3NklLa",
            "1hWrl3T1kIH5b9zRHLfCOn",
            "3ZUMC5OazTA8QtLpdlPdz9",
            "6nek1Nin9q48AVZcWs9e9D",
            "67awxiNHNyjMXhVgsHuIrs",
            "0yp6ui2sosUjCUro1rRk2Q",
            "1kAZhbcsXqfUjnVeqPywn2",
            "36482hNESSwELpr9sS3NbE",
            "6Uy6K3KdmUdAfelUp0SeXn",
            "2lwwrWVKdf3LR9lbbhnr6R",
            "1jJci4qxiYcOHhQR247rEU",
            "3lXYJJYqh2oFL1U3yVec73",
            "6GskIhdM6TN6EkPgeSjVfW",
            "22c2pt75xtnDddA5Zlm0yy",
            "4dTVgHZFPlaq9nPbLVVLSG",
            "1f8UCzB3RqIgNkW7QIiIeP",
            "4uqNn56KFQ7NtJ35xWZKvf"],
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


}

module.exports.Emotion = Emotion;