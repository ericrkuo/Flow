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
                    console.log(JSON.stringify(response.data));
                    // TODO: figure out what to do if there are multiple faces in the photo and if there are no faces in the photo
                    return response.data;
                })
                .catch((error) => {
                    console.log(error);
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