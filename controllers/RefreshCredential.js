const request = require("request");

class RefreshCredential {

    constructor(spotifyApi) {
        this.spotifyApi = spotifyApi;
        this.alreadyRefreshed = false;
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

    refreshCredentials(fnPtr, error) {
        if (this.alreadyRefreshed) throw error
        this.alreadyRefreshed = true;
        return this.getNewAccessToken().then((access_token) => {
            this.spotifyApi.setAccessToken(access_token);
            fnPtr();
        }).catch((err) => {
            console.log("Error in getting new access token" + err);
            throw err;
        });
    }

    getNewAccessToken() {
        let refresh_token = this.spotifyApi.getRefreshToken();
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
                    let accessToken = body.access_token;
                    fulfill(accessToken);
                } else {
                    console.log(error);
                    reject();
                }
            });
        });
    }
}

module.exports.RefreshCredential = RefreshCredential;