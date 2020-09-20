var express = require('express');
const {trackLimiter} = require("./rateLimiter");
const {checkCredentials} = require("./indexRouter");
var router = express.Router();
const {Main} = require("../controllers/Main")

//#region Sample Data For Testing Purposes
let tracks = {};
tracks["703Y8dw2MMfEodrw5D6hDd"] = {
    track: {
        "album": {
            "album_type": "album",
            "artists": [
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/5schXx0Ys4N52iU7On2j4c"
                    },
                    "href": "https://api.spotify.com/v1/artists/5schXx0Ys4N52iU7On2j4c",
                    "id": "5schXx0Ys4N52iU7On2j4c",
                    "name": "Made in M",
                    "type": "artist",
                    "uri": "spotify:artist:5schXx0Ys4N52iU7On2j4c"
                },
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/0SM6zo7lSdqyplZo6XRX76"
                    },
                    "href": "https://api.spotify.com/v1/artists/0SM6zo7lSdqyplZo6XRX76",
                    "id": "0SM6zo7lSdqyplZo6XRX76",
                    "name": "Smuv",
                    "type": "artist",
                    "uri": "spotify:artist:0SM6zo7lSdqyplZo6XRX76"
                }
            ],
            "available_markets": [
                "AD",
                "AE",
                "AR",
                "AT",
                "AU",
                "BE",
                "BG",
                "BH",
                "BO",
                "BR",
                "CA",
                "CH",
                "CL",
                "CO",
                "CR",
                "CY",
                "CZ",
                "DE",
                "DK",
                "DO",
                "DZ",
                "EC",
                "EE",
                "EG",
                "ES",
                "FI",
                "FR",
                "GB",
                "GR",
                "GT",
                "HK",
                "HN",
                "HU",
                "ID",
                "IE",
                "IL",
                "IN",
                "IS",
                "IT",
                "JO",
                "JP",
                "KW",
                "LB",
                "LI",
                "LT",
                "LU",
                "LV",
                "MA",
                "MC",
                "MT",
                "MX",
                "MY",
                "NI",
                "NL",
                "NO",
                "NZ",
                "OM",
                "PA",
                "PE",
                "PH",
                "PL",
                "PS",
                "PT",
                "PY",
                "QA",
                "RO",
                "SA",
                "SE",
                "SG",
                "SK",
                "SV",
                "TH",
                "TN",
                "TR",
                "TW",
                "US",
                "UY",
                "VN",
                "ZA"
            ],
            "external_urls": {
                "spotify": "https://open.spotify.com/album/54mO5n5EwJJFXFa0oPse02"
            },
            "href": "https://api.spotify.com/v1/albums/54mO5n5EwJJFXFa0oPse02",
            "id": "54mO5n5EwJJFXFa0oPse02",
            "images": [
                {
                    "height": 640,
                    "url": "https://i.scdn.co/image/ab67616d0000b27362bb8c7bc046aabe09a5203e",
                    "width": 640
                },
                {
                    "height": 300,
                    "url": "https://i.scdn.co/image/ab67616d00001e0262bb8c7bc046aabe09a5203e",
                    "width": 300
                },
                {
                    "height": 64,
                    "url": "https://i.scdn.co/image/ab67616d0000485162bb8c7bc046aabe09a5203e",
                    "width": 64
                }
            ],
            "name": "Nest",
            "release_date": "2016-11-04",
            "release_date_precision": "day",
            "total_tracks": 24,
            "type": "album",
            "uri": "spotify:album:54mO5n5EwJJFXFa0oPse02"
        },
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/5schXx0Ys4N52iU7On2j4c"
                },
                "href": "https://api.spotify.com/v1/artists/5schXx0Ys4N52iU7On2j4c",
                "id": "5schXx0Ys4N52iU7On2j4c",
                "name": "Made in M",
                "type": "artist",
                "uri": "spotify:artist:5schXx0Ys4N52iU7On2j4c"
            },
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/0SM6zo7lSdqyplZo6XRX76"
                },
                "href": "https://api.spotify.com/v1/artists/0SM6zo7lSdqyplZo6XRX76",
                "id": "0SM6zo7lSdqyplZo6XRX76",
                "name": "Smuv",
                "type": "artist",
                "uri": "spotify:artist:0SM6zo7lSdqyplZo6XRX76"
            }
        ],
        "available_markets": [
            "AD",
            "AE",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BH",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "DZ",
            "EC",
            "EE",
            "EG",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IN",
            "IS",
            "IT",
            "JO",
            "JP",
            "KW",
            "LB",
            "LI",
            "LT",
            "LU",
            "LV",
            "MA",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "OM",
            "PA",
            "PE",
            "PH",
            "PL",
            "PS",
            "PT",
            "PY",
            "QA",
            "RO",
            "SA",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TN",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 92250,
        "explicit": false,
        "external_ids": {
            "isrc": "DEQ121642402"
        },
        "external_urls": {
            "spotify": "https://open.spotify.com/track/703Y8dw2MMfEodrw5D6hDd"
        },
        "href": "https://api.spotify.com/v1/tracks/703Y8dw2MMfEodrw5D6hDd",
        "id": "703Y8dw2MMfEodrw5D6hDd",
        "is_local": false,
        "name": "Old Roots New Trees",
        "popularity": 60,
        "preview_url": "https://p.scdn.co/mp3-preview/1954c2e4dbf035d82648a9cec39dd144ffc27c0d?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 21,
        "type": "track",
        "uri": "spotify:track:703Y8dw2MMfEodrw5D6hDd"
    },
    audioFeatures: {
        "danceability": 0.857,
        "energy": 0.146,
        "loudness": 0.8175666666666667,
        "speechiness": 0.33,
        "acousticness": 0.838,
        "instrumentalness": 0.954,
        "liveness": 0.109,
        "valence": 0.776,
        "tempo": 0.3316
    }
}

tracks["2RycgtfFQZOPgEGrzBGE0j"] = {
    track: {
        "album": {
            "album_type": "album",
            "artists": [
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/5XTn5Az9AcSKu0oaauC5ES"
                    },
                    "href": "https://api.spotify.com/v1/artists/5XTn5Az9AcSKu0oaauC5ES",
                    "id": "5XTn5Az9AcSKu0oaauC5ES",
                    "name": "quickly, quickly",
                    "type": "artist",
                    "uri": "spotify:artist:5XTn5Az9AcSKu0oaauC5ES"
                }
            ],
            "available_markets": [
                "AD",
                "AE",
                "AR",
                "AT",
                "AU",
                "BE",
                "BG",
                "BH",
                "BO",
                "BR",
                "CA",
                "CH",
                "CL",
                "CO",
                "CR",
                "CY",
                "CZ",
                "DE",
                "DK",
                "DO",
                "DZ",
                "EC",
                "EE",
                "EG",
                "ES",
                "FI",
                "FR",
                "GB",
                "GR",
                "GT",
                "HK",
                "HN",
                "HU",
                "ID",
                "IE",
                "IL",
                "IN",
                "IS",
                "IT",
                "JO",
                "JP",
                "KW",
                "LB",
                "LI",
                "LT",
                "LU",
                "LV",
                "MA",
                "MC",
                "MT",
                "MX",
                "MY",
                "NI",
                "NL",
                "NO",
                "NZ",
                "OM",
                "PA",
                "PE",
                "PH",
                "PL",
                "PS",
                "PT",
                "PY",
                "QA",
                "RO",
                "SA",
                "SE",
                "SG",
                "SK",
                "SV",
                "TH",
                "TN",
                "TR",
                "TW",
                "US",
                "UY",
                "VN",
                "ZA"
            ],
            "external_urls": {
                "spotify": "https://open.spotify.com/album/2JhVhsYSe65vunncE4AYV1"
            },
            "href": "https://api.spotify.com/v1/albums/2JhVhsYSe65vunncE4AYV1",
            "id": "2JhVhsYSe65vunncE4AYV1",
            "images": [
                {
                    "height": 640,
                    "url": "https://i.scdn.co/image/ab67616d0000b273c417aad130701f49d8e629b8",
                    "width": 640
                },
                {
                    "height": 300,
                    "url": "https://i.scdn.co/image/ab67616d00001e02c417aad130701f49d8e629b8",
                    "width": 300
                },
                {
                    "height": 64,
                    "url": "https://i.scdn.co/image/ab67616d00004851c417aad130701f49d8e629b8",
                    "width": 64
                }
            ],
            "name": "Quickly Quickly, Vol. 1",
            "release_date": "2017-04-16",
            "release_date_precision": "day",
            "total_tracks": 10,
            "type": "album",
            "uri": "spotify:album:2JhVhsYSe65vunncE4AYV1"
        },
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/5XTn5Az9AcSKu0oaauC5ES"
                },
                "href": "https://api.spotify.com/v1/artists/5XTn5Az9AcSKu0oaauC5ES",
                "id": "5XTn5Az9AcSKu0oaauC5ES",
                "name": "quickly, quickly",
                "type": "artist",
                "uri": "spotify:artist:5XTn5Az9AcSKu0oaauC5ES"
            }
        ],
        "available_markets": [
            "AD",
            "AE",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BH",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "DZ",
            "EC",
            "EE",
            "EG",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IN",
            "IS",
            "IT",
            "JO",
            "JP",
            "KW",
            "LB",
            "LI",
            "LT",
            "LU",
            "LV",
            "MA",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "OM",
            "PA",
            "PE",
            "PH",
            "PL",
            "PS",
            "PT",
            "PY",
            "QA",
            "RO",
            "SA",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TN",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 332173,
        "explicit": false,
        "external_ids": {
            "isrc": "QMPKX1729751"
        },
        "external_urls": {
            "spotify": "https://open.spotify.com/track/2RycgtfFQZOPgEGrzBGE0j"
        },
        "href": "https://api.spotify.com/v1/tracks/2RycgtfFQZOPgEGrzBGE0j",
        "id": "2RycgtfFQZOPgEGrzBGE0j",
        "is_local": false,
        "name": "Getsomerest/sleepwell",
        "popularity": 67,
        "preview_url": "https://p.scdn.co/mp3-preview/15edb3e9d1647124a20350e8d9ec66893120378c?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 10,
        "type": "track",
        "uri": "spotify:track:2RycgtfFQZOPgEGrzBGE0j"
    },
    audioFeatures: {
        "danceability": 0.637,
        "energy": 0.394,
        "loudness": 0.7744,
        "speechiness": 0.286,
        "acousticness": 0.605,
        "instrumentalness": 0.305,
        "liveness": 0.0968,
        "valence": 0.361,
        "tempo": 0.52806
    }
}

tracks["1a31jGgyZ5c2d10CPWkGxM"] = {
    track: {
        "album": {
            "album_type": "single",
            "artists": [
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/0HcyeAioEKhfwVcJAoyN36"
                    },
                    "href": "https://api.spotify.com/v1/artists/0HcyeAioEKhfwVcJAoyN36",
                    "id": "0HcyeAioEKhfwVcJAoyN36",
                    "name": "Knowmadic",
                    "type": "artist",
                    "uri": "spotify:artist:0HcyeAioEKhfwVcJAoyN36"
                }
            ],
            "available_markets": [
                "AD",
                "AE",
                "AR",
                "AT",
                "AU",
                "BE",
                "BG",
                "BH",
                "BO",
                "BR",
                "CA",
                "CH",
                "CL",
                "CO",
                "CR",
                "CY",
                "CZ",
                "DE",
                "DK",
                "DO",
                "DZ",
                "EC",
                "EE",
                "EG",
                "ES",
                "FI",
                "FR",
                "GB",
                "GR",
                "GT",
                "HK",
                "HN",
                "HU",
                "ID",
                "IE",
                "IL",
                "IN",
                "IS",
                "IT",
                "JO",
                "JP",
                "KW",
                "LB",
                "LI",
                "LT",
                "LU",
                "LV",
                "MA",
                "MC",
                "MT",
                "MX",
                "MY",
                "NI",
                "NL",
                "NO",
                "NZ",
                "OM",
                "PA",
                "PE",
                "PH",
                "PL",
                "PS",
                "PT",
                "PY",
                "QA",
                "RO",
                "SA",
                "SE",
                "SG",
                "SK",
                "SV",
                "TH",
                "TN",
                "TR",
                "TW",
                "US",
                "UY",
                "VN",
                "ZA"
            ],
            "external_urls": {
                "spotify": "https://open.spotify.com/album/3fnNTl700nWn7bK3glgmHl"
            },
            "href": "https://api.spotify.com/v1/albums/3fnNTl700nWn7bK3glgmHl",
            "id": "3fnNTl700nWn7bK3glgmHl",
            "images": [
                {
                    "height": 640,
                    "url": "https://i.scdn.co/image/ab67616d0000b273a552a98a4e8c8a3d569afc1f",
                    "width": 640
                },
                {
                    "height": 300,
                    "url": "https://i.scdn.co/image/ab67616d00001e02a552a98a4e8c8a3d569afc1f",
                    "width": 300
                },
                {
                    "height": 64,
                    "url": "https://i.scdn.co/image/ab67616d00004851a552a98a4e8c8a3d569afc1f",
                    "width": 64
                }
            ],
            "name": "Fade",
            "release_date": "2017-04-09",
            "release_date_precision": "day",
            "total_tracks": 1,
            "type": "album",
            "uri": "spotify:album:3fnNTl700nWn7bK3glgmHl"
        },
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/0HcyeAioEKhfwVcJAoyN36"
                },
                "href": "https://api.spotify.com/v1/artists/0HcyeAioEKhfwVcJAoyN36",
                "id": "0HcyeAioEKhfwVcJAoyN36",
                "name": "Knowmadic",
                "type": "artist",
                "uri": "spotify:artist:0HcyeAioEKhfwVcJAoyN36"
            }
        ],
        "available_markets": [
            "AD",
            "AE",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BH",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "DZ",
            "EC",
            "EE",
            "EG",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IN",
            "IS",
            "IT",
            "JO",
            "JP",
            "KW",
            "LB",
            "LI",
            "LT",
            "LU",
            "LV",
            "MA",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "OM",
            "PA",
            "PE",
            "PH",
            "PL",
            "PS",
            "PT",
            "PY",
            "QA",
            "RO",
            "SA",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TN",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 157000,
        "explicit": false,
        "external_ids": {
            "isrc": "TCACZ1795346"
        },
        "external_urls": {
            "spotify": "https://open.spotify.com/track/1a31jGgyZ5c2d10CPWkGxM"
        },
        "href": "https://api.spotify.com/v1/tracks/1a31jGgyZ5c2d10CPWkGxM",
        "id": "1a31jGgyZ5c2d10CPWkGxM",
        "is_local": false,
        "name": "Fade",
        "popularity": 44,
        "preview_url": "https://p.scdn.co/mp3-preview/c49a73aa7328443e3f0e25ceee6a6cb2205d0cab?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 1,
        "type": "track",
        "uri": "spotify:track:1a31jGgyZ5c2d10CPWkGxM"
    },
    audioFeatures: {
        "danceability": 0.693,
        "energy": 0.325,
        "loudness": 0.7872666666666668,
        "speechiness": 0.235,
        "acousticness": 0.943,
        "instrumentalness": 0.235,
        "liveness": 0.0941,
        "valence": 0.511,
        "tempo": 0.29594
    }
}

tracks["0BD9XqvXSSxlHsdBlLKhqA"] = {
    track: {
        "album": {
            "album_type": "album",
            "artists": [
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/6x5HLaMcoxaULXpgN0NJbb"
                    },
                    "href": "https://api.spotify.com/v1/artists/6x5HLaMcoxaULXpgN0NJbb",
                    "id": "6x5HLaMcoxaULXpgN0NJbb",
                    "name": "Flughand",
                    "type": "artist",
                    "uri": "spotify:artist:6x5HLaMcoxaULXpgN0NJbb"
                }
            ],
            "available_markets": [
                "AD",
                "AE",
                "AR",
                "AT",
                "AU",
                "BE",
                "BG",
                "BH",
                "BO",
                "BR",
                "CA",
                "CH",
                "CL",
                "CO",
                "CR",
                "CY",
                "CZ",
                "DE",
                "DK",
                "DO",
                "DZ",
                "EC",
                "EE",
                "EG",
                "ES",
                "FI",
                "FR",
                "GB",
                "GR",
                "GT",
                "HK",
                "HN",
                "HU",
                "ID",
                "IE",
                "IL",
                "IN",
                "IS",
                "IT",
                "JO",
                "JP",
                "KW",
                "LB",
                "LI",
                "LT",
                "LU",
                "LV",
                "MA",
                "MC",
                "MT",
                "MX",
                "MY",
                "NI",
                "NL",
                "NO",
                "NZ",
                "OM",
                "PA",
                "PE",
                "PH",
                "PL",
                "PS",
                "PT",
                "PY",
                "QA",
                "RO",
                "SA",
                "SE",
                "SG",
                "SK",
                "SV",
                "TH",
                "TN",
                "TR",
                "TW",
                "US",
                "UY",
                "VN",
                "ZA"
            ],
            "external_urls": {
                "spotify": "https://open.spotify.com/album/6Ads7rAZhNDWrcZqaCwJg6"
            },
            "href": "https://api.spotify.com/v1/albums/6Ads7rAZhNDWrcZqaCwJg6",
            "id": "6Ads7rAZhNDWrcZqaCwJg6",
            "images": [
                {
                    "height": 640,
                    "url": "https://i.scdn.co/image/ab67616d0000b273d6d7ecd82517d793aabf67f0",
                    "width": 640
                },
                {
                    "height": 300,
                    "url": "https://i.scdn.co/image/ab67616d00001e02d6d7ecd82517d793aabf67f0",
                    "width": 300
                },
                {
                    "height": 64,
                    "url": "https://i.scdn.co/image/ab67616d00004851d6d7ecd82517d793aabf67f0",
                    "width": 64
                }
            ],
            "name": "EXPEDITion Vol. 7: Moonloops",
            "release_date": "2016-02-26",
            "release_date_precision": "day",
            "total_tracks": 18,
            "type": "album",
            "uri": "spotify:album:6Ads7rAZhNDWrcZqaCwJg6"
        },
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/6x5HLaMcoxaULXpgN0NJbb"
                },
                "href": "https://api.spotify.com/v1/artists/6x5HLaMcoxaULXpgN0NJbb",
                "id": "6x5HLaMcoxaULXpgN0NJbb",
                "name": "Flughand",
                "type": "artist",
                "uri": "spotify:artist:6x5HLaMcoxaULXpgN0NJbb"
            }
        ],
        "available_markets": [
            "AD",
            "AE",
            "AR",
            "AT",
            "AU",
            "BE",
            "BG",
            "BH",
            "BO",
            "BR",
            "CA",
            "CH",
            "CL",
            "CO",
            "CR",
            "CY",
            "CZ",
            "DE",
            "DK",
            "DO",
            "DZ",
            "EC",
            "EE",
            "EG",
            "ES",
            "FI",
            "FR",
            "GB",
            "GR",
            "GT",
            "HK",
            "HN",
            "HU",
            "ID",
            "IE",
            "IL",
            "IN",
            "IS",
            "IT",
            "JO",
            "JP",
            "KW",
            "LB",
            "LI",
            "LT",
            "LU",
            "LV",
            "MA",
            "MC",
            "MT",
            "MX",
            "MY",
            "NI",
            "NL",
            "NO",
            "NZ",
            "OM",
            "PA",
            "PE",
            "PH",
            "PL",
            "PS",
            "PT",
            "PY",
            "QA",
            "RO",
            "SA",
            "SE",
            "SG",
            "SK",
            "SV",
            "TH",
            "TN",
            "TR",
            "TW",
            "US",
            "UY",
            "VN",
            "ZA"
        ],
        "disc_number": 1,
        "duration_ms": 93635,
        "explicit": false,
        "external_ids": {
            "isrc": "DEQ121637902"
        },
        "external_urls": {
            "spotify": "https://open.spotify.com/track/0BD9XqvXSSxlHsdBlLKhqA"
        },
        "href": "https://api.spotify.com/v1/tracks/0BD9XqvXSSxlHsdBlLKhqA",
        "id": "0BD9XqvXSSxlHsdBlLKhqA",
        "is_local": false,
        "name": "Feblu",
        "popularity": 63,
        "preview_url": "https://p.scdn.co/mp3-preview/0ea98e690511d73c52f47d613fe747fe4f78f5e9?cid=774b29d4f13844c495f206cafdad9c86",
        "track_number": 2,
        "type": "track",
        "uri": "spotify:track:0BD9XqvXSSxlHsdBlLKhqA"
    },
    audioFeatures: {
        "danceability": 0.769,
        "energy": 0.277,
        "loudness": 0.8604166666666667,
        "speechiness": 0.095,
        "acousticness": 0.897,
        "instrumentalness": 0.862,
        "liveness": 0.118,
        "valence": 0.641,
        "tempo": 0.323804
    }
}


let sampleData = {
    tracks: tracks,
    userInfo: {
        "display_name": "Eric Kuo",
        "email": "ericrkuo@gmail.com",
        "external_urls": {
            "spotify": "https://open.spotify.com/"
        },
        "images": [
            {
                "height": null,
                "url": "../libraries/pictures/unknownuser.png",
                "width": null
            }
        ]
    },
    mood: {
        "dominantMood": "surprise",
        "emotions": {
            "anger": 0.575,
            "contempt": 0,
            "disgust": 0.006,
            "fear": 0.008,
            "happiness": 0.394,
            "neutral": 0.013,
            "sadness": 0,
            "surprise": 0.004
        }
    },
    test: {"I'm": 2},
}
//#endregion

// input: dataURL
// output: returns html rendering of the tracks
router.get('/', function (req, res, next) {
    // use res.render("track", sampleData) for testing purposes

    return checkCredentials(req)
        .then((isCredentialValid) => {
            if (isCredentialValid) {
                if (req.app.locals.main.result) {
                    return res.render("track", req.app.locals.main.result);
                } else {
                    // TODO: at this point, user's credentials are valid, but they do not have custom curated tracks
                    //  display an 'error' page, which tells user they need to take a photo, and has a button prompting to go back to homepage
                    return res.render('error', {
                        message: "No custom tracks yet, please take a photo to get curated tracks",
                        error: {status: 400, stack: "no stack"}
                    });
                }
            } else {
                return res.redirect("/spotify/login");
            }
        })
        .catch((err) => {
            // TODO: just in case checkCredentials throws an error (highly unlikely)
            console.log(err);
        })
});

// REQUIRES: req.body to contain a list of track URI's in format ["spotify:track:1ue7zm5TVVvmoQV8lK6K2H", ...]
router.post('/', trackLimiter, function (req, res, next) {
    let main = req.app.locals.main;
    return main.createMoodPlaylist(req.body)
        .then((playlistURL) => {
            return res.status(200).json({link: playlistURL});
        })
        .catch((err) => {
            console.log(err);
            return res.status(400).json({"error": err.message});
        })
});

module.exports = router;
