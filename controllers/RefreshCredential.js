const request = require("request");
const {InvalidResponseError, InvalidInputError} = require("./Error");

class RefreshCredential {

    constructor(spotifyApi) {
        require('dotenv').config();
        if (!spotifyApi) throw new Error("spotifyApi is null or undefined");
        this.spotifyApi = spotifyApi;
    }

    handleRefreshCredential(fnPtr, err) {
        return this.checkCredentials()
            .then((isValidCredential) => {
                if (isValidCredential) {
                    console.log(err);
                    throw err;
                } else {
                    return this.refreshCredential(fnPtr);
                }
            });
    }

    checkCredentials() {
        return this.spotifyApi.getArtist('2hazSY4Ef3aB9ATXW7F5w3')
            .then((data) => {
                return true;
            })
            .catch((err) => {
                return false;
            })
    }

    refreshCredential(fnPtr) {
        return this.getNewAccessToken()
            .then((access_token) => {
                this.spotifyApi.setAccessToken(access_token);
                if (typeof fnPtr === 'function') return fnPtr();
            }).catch((err) => {
                console.log("Error in getting new access token " + err);
                throw err;
            });
    }

    getNewAccessToken() {
        let refresh_token = this.spotifyApi.getRefreshToken();
        if (!refresh_token) {
            throw new InvalidInputError("Refresh token is null or undefined");
        }

        try {
            let axios = require('axios');
            let qs = require('querystring');
            let data = qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
            });

            let config = {
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_API_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
                    'Content-type': "application/x-www-form-urlencoded",
                },
                data: data
            };

            return axios(config)
                .then((response) => {
                    if (response && response.data && response.data["access_token"]) {
                        console.log(response.data);
                        return response.data["access_token"];
                    } else {
                        throw new InvalidResponseError("Response from Azure Face API is invalid")
                    }
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.error) {
                        throw new Error(JSON.stringify(error.response.data.error));
                    }
                    throw error;
                });
        } catch (error) {
            throw error;
        }
    }
}

module.exports.RefreshCredential = RefreshCredential;