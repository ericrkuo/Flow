const Error = require("./Error");

class AzureFaceAPI {

    getEmotions(dataURI) {
        try {
            let data = this.convertDataURIToBinary(dataURI);
            let axios = require('axios');

            let config = {
                method: 'post',
                url: 'https://flowfaceapi.cognitiveservices.azure.com/face/v1.0/detect',
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.AZUREKEY,
                    'Content-Type': 'application/octet-stream'
                },
                params: {
                    returnFaceID: true,
                    returnFaceLandmarks: false,
                    returnFaceAttributes: 'age,gender,headPose,smile,facialHair,emotion',
                    recognitionModel: 'recognition_03',
                    detectionModel: 'detection_01'
                },
                data: data
            };

            return axios(config)
                .then((response) => {
                    return this.handleResponse(response);
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.error) {
                        throw new Error(JSON.stringify(error.response.data.error));
                    }
                    throw error;
                });
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    handleResponse(response) {
        if (!this.isResponseValid(response)) throw new Error.InvalidResponseError("Response from Azure Face API is invalid - null or not an array");
        if (response.data.length === 0) throw new Error.NoUserDetectedError();
        if (!this.isResponseDataValid(response.data)) throw new Error.InvalidResponseError("Response from Azure Face API is invalid - no faceAttributes or emotions");

        let emotionData = response.data[0]["faceAttributes"]["emotion"];
        console.log(JSON.stringify(response.data));
        return emotionData;
    }

    isResponseValid(response) {
        return response && response.data && Array.isArray(response.data);
    }

    isResponseDataValid(responseData) {
        return responseData[0]["faceAttributes"] && responseData[0]["faceAttributes"]["emotion"];
    }

    convertDataURIToBinary(dataURI) {
        if (!dataURI || typeof dataURI !== 'string') throw new Error.InvalidInputError("dataURI is formatted improperly");

        let BASE64_MARKER = ';base64,';
        let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        let base64 = dataURI.substring(base64Index);
        let raw = Buffer.from(base64, 'base64').toString("binary");
        let rawLength = raw.length;
        let array = new Uint8Array(new ArrayBuffer(rawLength));

        for (let i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    }
}

module.exports.AzureFaceAPI = AzureFaceAPI;