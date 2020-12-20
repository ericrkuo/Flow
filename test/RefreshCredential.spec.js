const chai = require("chai");
const SpotifyWebApi = require('spotify-web-api-node');
const Err = require("../controllers/Error");
const {Emotion} = require("../controllers/Emotion");
const {Spotify} = require("../controllers/Spotify");
const {RefreshCredential} = require("../controllers/RefreshCredential");

let emotion;
let spotify;
let refreshCredential;
let spotifyApi;
let expiredAccessToken = "BQAbGNeDb2Dzq_jKEF6HnKbx4LE9e1nmhh8JKLRJYB0bUXjdYyFZXpY0xDbNs5j9CgdsJ4i04uChEQubQUT7Fwx_q-72rqHmlhT-yongaIVtkENGEesDRS4lp7zFv4G1OFSWPa6aHy6_XvAdvqQBVr_1dIoPz7FjVXmVo3yfFMjmwCzxYZvP3bQn2B-lqa56-38DlSSeAhtHZca5Z9V4-MhjR_e2gf_FlfFCsFhVdS71NBCvLwR_Ty1jxg_JDTaWeCByukgP37mmVjnyVFE";

describe("test refreshing with credentials", function () {

    beforeEach(function () {
        require('dotenv').config();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        spotify = new Spotify(spotifyApi);
        emotion = new Emotion(spotifyApi);
        refreshCredential = new RefreshCredential(spotifyApi);
    });

    it("test checkCredentials should return false if expired credentials", function () {
        spotifyApi.setAccessToken(expiredAccessToken);
        return refreshCredential.checkCredentials().then((result) => {
            chai.assert.isFalse(result)
        }).catch((err) => {
            console.log(err)
            chai.expect.fail("not supposed to fail");
        });
    });

    it("test checkCredentials should return true if credentials are okay", function () {
        return refreshCredential.tryRefreshCredential()
            .then(() => {
                return refreshCredential.checkCredentials()
            })
            .then((result) => {
                chai.assert.isTrue(result)
            }).catch((err) => {
                chai.expect.fail("not supposed to fail");
            });
    });

    it("test refreshCredential - no refresh token", function () {
        spotifyApi.setRefreshToken(undefined);
        return refreshCredential.tryRefreshCredential()
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((e) => {
                console.log("Caught error" + e);
                chai.expect(e).to.be.instanceOf(Err.RefreshCredentialError);
            });
    });

    it("test refreshCredential - expect success", function () {
        let oldAccessToken = spotifyApi.getAccessToken();
        return refreshCredential.tryRefreshCredential()
            .then((newAccessToken) => {
                chai.expect(oldAccessToken).to.not.equal(newAccessToken);
            })
            .catch((e) => {
                console.log("Caught error" + e);
                chai.expect.fail("not supposed to fail");
            })
    });
});