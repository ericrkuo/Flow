const request = require("request");

class AzureFaceAPI {

    getEmotions(dataURI) {
        let emotionString;
        const subscriptionKey = process.env.AZUREKEY;
        const uriBase = 'https://flowapi.cognitiveservices.azure.com/face/v1.0/detect';

        // Request parameters.
        const params = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'false',
            'returnFaceAttributes': 'age,gender,smile,' +
                'emotion'
            // 'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
            //     'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
        };

        const options = {
            uri: uriBase,
            qs: params,
            body: this.convertDataURIToBinary(dataURI),
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };
        return new Promise(function(fullfill, reject) {
            request.post(options, (error, response, body) => {
                if (error) {
                    console.log('Error: ', error);
                    reject();
                }

                let json = JSON.parse(body);
                let jsonResult = JSON.stringify(json, null, " ");
                // let indexOfEmotions = jsonResult.indexOf("emotion");
                // let emotionString = jsonResult.substr(indexOfEmotions, jsonResult.length);
                fullfill(json);

            });
        });

    }

    convertDataURIToBinary(dataURI){
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