var chai = require("chai");
var sampleDataURL = require("./sampleDataURL");
const request = require('request');
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");

describe("unit test for dataURL", function () {

    before(function () {
        require('dotenv').config();
    });

    // it("test using chai expect ", function () {
    //     chai.expect(sampleDataURL.dataURL1).equal(sampleDataURL.dataURL2);
    // });

    it("call successful Azure Face API", function () {
        let azureFaceAPI = new AzureFaceAPI();
        return azureFaceAPI.getEmotions(sampleDataURL.dataURL2).then((res)=>{
            console.log(res);
            chai.assert(true);
        }).catch((err) => {
            chai.expect.fail("not supposed to fail");
        });
    });

    it("try to call face azure API with URL", function () {
        // Replace <Subscription Key> with your valid subscription key.
        const subscriptionKey = process.env.AZUREKEY;
        const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

        const imageUrl =
            'https://upload.wikimedia.org/wikipedia/commons/3/37/Dagestani_man_and_woman.jpg';

        // Request parameters.
        const params = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'false',
            'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
                'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
        };

        const options = {
            uri: uriBase,
            qs: params,
            body: '{"url": ' + '"' + imageUrl + '"}',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };

        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                return;
            }
            let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
            console.log('JSON Response\n');
            console.log(jsonResponse);
        });
    });

    it("try to call face azure API with binary data", function () {
        // Replace <Subscription Key> with your valid subscription key.
        let azureFaceAPI = new AzureFaceAPI();
        const subscriptionKey = process.env.AZUREKEY;
        const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';

        // Request parameters.
        const params = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'false',
            'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
                'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
        };

        const options = {
            uri: uriBase,
            qs: params,
            body: azureFaceAPI.convertDataURIToBinary(sampleDataURL.dataURL2),
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        };
        request.post(options, (error, response, body) => {
            if (error) {
                console.log('Error: ', error);
                return;
            }
            let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
            console.log('JSON Response\n');
            console.log(jsonResponse);
        });
    });
});
