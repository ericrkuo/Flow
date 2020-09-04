const {InvalidResponseError, NoUserDetectedError} = require("./Error");

class AzureFaceAPI {

    getEmotions(dataURI) {
        try {
            let axios = require('axios');
            let data = this.convertDataURIToBinary(dataURI);

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
                    if (response && response.data && Array.isArray(response.data)) {
                        if (response.data.length > 0) {
                            let result = response.data;
                            console.log(JSON.stringify(result));
                            return result;
                        } else {
                            throw new NoUserDetectedError();
                        }
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

    convertDataURIToBinary(dataURI) {
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