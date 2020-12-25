const chai = require("chai");
const SpotifyWebApi = require("spotify-web-api-node");
const Err = require("../../src/constant/Error");
const {RefreshCredentialService} = require("../../src/service/RefreshCredentialService");

let refreshCredentialService;
let spotifyApi;
const expiredAccessToken = "BQAbGNeDb2Dzq_jKEF6HnKbx4LE9e1nmhh8JKLRJYB0bUXjdYyFZXpY0xDbNs5j9CgdsJ4i04uChEQubQUT7Fwx_q-72rqHmlhT-yongaIVtkENGEesDRS4lp7zFv4G1OFSWPa6aHy6_XvAdvqQBVr_1dIoPz7FjVXmVo3yfFMjmwCzxYZvP3bQn2B-lqa56-38DlSSeAhtHZca5Z9V4-MhjR_e2gf_FlfFCsFhVdS71NBCvLwR_Ty1jxg_JDTaWeCByukgP37mmVjnyVFE";

describe("test refreshing with credentials", function () {

    beforeEach(function () {
        require("dotenv").config();
        spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_API_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.CALLBACK_URL,
        });
        spotifyApi.setAccessToken(process.env.ACCESS_TOKEN);
        spotifyApi.setRefreshToken(process.env.REFRESH_TOKEN);
        refreshCredentialService = new RefreshCredentialService(spotifyApi);
    });

    it("test checkCredentials should return false if expired credentials", function () {
        spotifyApi.setAccessToken(expiredAccessToken);
        return refreshCredentialService.checkCredentials().then((result) => {
            chai.assert.isFalse(result);
        }).catch((err) => {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        });
    });

    it("test checkCredentials should return true if credentials are okay", function () {
        return refreshCredentialService.tryRefreshCredential()
            .then(() => {
                return refreshCredentialService.checkCredentials();
            })
            .then((result) => {
                chai.assert.isTrue(result);
            }).catch((err) => {
                chai.expect.fail("not supposed to fail" + err);
            });
    });

    it("test refreshCredential - no refresh token", function () {
        spotifyApi.setRefreshToken(undefined);
        return refreshCredentialService.tryRefreshCredential()
            .then(() => {
                chai.expect.fail("supposed to fail");
            })
            .catch((e) => {
                console.log("Caught error" + e);
                chai.expect(e).to.be.instanceOf(Err.RefreshCredentialError);
            });
    });

    it("test refreshCredential - expect success", function () {
        const oldAccessToken = spotifyApi.getAccessToken();
        return refreshCredentialService.tryRefreshCredential()
            .then((newAccessToken) => {
                chai.expect(oldAccessToken).to.not.equal(newAccessToken);
            })
            .catch((e) => {
                console.log("Caught error" + e);
                chai.expect.fail("not supposed to fail");
            });
    });
});