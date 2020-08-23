const request = require("request");

class RefreshCredential {

    constructor(spotifyApi) {
        if(!spotifyApi) throw new Error("spotifyApi is null or undefined");
        this.spotifyApi = spotifyApi;
    }

    handleRefreshCredential(fnPtr, err) {
        return this.checkCredentials()
            .then(isValidCredential => {
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
                return fnPtr();
        }).catch((err) => {
            console.log("Error in getting new access token " + err);
            throw err;
        });
    }

    getNewAccessToken() {
        let refresh_token = this.spotifyApi.getRefreshToken();

        if(!refresh_token) {
            throw new Error("Refresh token is null or undefined");
        }

        let authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {'Authorization': 'Basic ' + Buffer.from(process.env.SPOTIFY_API_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString("base64")},
            form: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
            },
            json: true
        };

        return new Promise(function (fulfill, reject) {
            request.post(authOptions, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    return fulfill(body.access_token);
                } else {
                    console.log(error);
                    return reject(error);
                }
            });
        });
    }
}

module.exports.RefreshCredential = RefreshCredential;