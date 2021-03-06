const Err = require("../constant/Error");
const {executeMethod} = require("./SpotifyApiWrapper");

class RefreshCredentialService {

    /**
     * Constructor for RefreshCredentialService
     * @param spotifyApi - current instance of spotifyApi
     */
    constructor(spotifyApi) {
        require("dotenv").config();
        if (!spotifyApi) throw new Error("The spotifyApi is null or undefined");
        this.spotifyApi = spotifyApi;
    }

    /**
     * Checks if credentials are valid and have not expired through a call to spotifyApi.getArtist
     * @returns boolean - returns true if credentials are still valid
     */
    checkCredentials() {
        return executeMethod(() => {
            return this.spotifyApi.getArtist("2hazSY4Ef3aB9ATXW7F5w3");
        })
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    /**
     * Checks credential and attempts to get/set a new access token with existing refresh token
     * Note: this is only used internally for testing
     * @returns {Promise<T | void>}
     */
    tryRefreshCredential() {
        return this.checkCredentials()
            .then((isValidCredential) => {
                if (!isValidCredential) {
                    return this.getNewAccessToken()
                        .then((accessToken) => {
                            this.spotifyApi.setAccessToken(accessToken);
                        });
                }
            })
            .catch((err) => {
                console.log("Error in getting new access token " + err);
                throw err;
            });
    }

    /**
     * Gets the new access token using refresh token by issuing a POST request to spotifyApi
     * @returns {Promise<never>|Promise<* | void>}
     */
    getNewAccessToken() {
        const refresh_token = this.spotifyApi.getRefreshToken();
        if (!refresh_token) {
            return Promise.reject(new Err.RefreshCredentialError("Refresh token is null or undefined"));
        }

        const axios = require("axios");
        const qs = require("querystring");
        const data = qs.stringify({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
        });

        const config = {
            method: "post",
            url: "https://accounts.spotify.com/api/token",
            headers: {
                "Authorization": "Basic " + Buffer.from(process.env.SPOTIFY_API_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64"),
                "Content-type": "application/x-www-form-urlencoded",
            },
            data: data,
        };

        return axios(config)
            .then((response) => {
                if (response && response.data && response.data["access_token"]) {
                    return response.data["access_token"];
                } else {
                    throw new Err.InvalidResponseError("Access token response from Spotify API is invalid");
                }
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data) {
                    throw new Err.RefreshCredentialError(JSON.stringify(error.response.data));
                }
                throw error;
            });
    }
}

module.exports.RefreshCredentialService = RefreshCredentialService;
