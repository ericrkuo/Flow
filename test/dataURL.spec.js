var chai = require("chai");
var dataURL = require("../controllers/dataURL");
const request = require('request');

describe("unit test for dataURL", function () {
    before(function(){
       require('dotenv').config();
    });
    it("checkifEqual", function () {
        chai.expect(dataURL.browserDATAURL).equal(dataURL.serverDATAURL1);
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

    // TODO: put this into an azureFaceAPI.js and make it a class file that can be exported
    it("try to call face azure API with binary data", function () {
        // Replace <Subscription Key> with your valid subscription key.
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
            body: convertDataURIToBinary(),
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

    let convertDataURIToBinary = () => {
        let dataURI = dataURL.serverDATAURL1;
        var BASE64_MARKER = ';base64,';
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = Buffer.from(base64, 'base64').toString("binary");
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for(var i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;
    };

    // IGNORE
    // TODO: clean up later
    function getBinaryData2() {
        let f = open("C:\\Users\\Eric Kuo\\WebstormProjects\\Flow\\test\\image.jpg", "rb");
        return f.read();
    }
    function getBinaryData() {
        let dataURI = dataURL.serverDATAURL1;
        let x = dataURI.split(',')[1];
        var byteString = Buffer.from(x, 'base64').toString("binary");
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var _ia = new Uint8Array(arrayBuffer);
        for (var i = 0; i < byteString.length; i++) {
            _ia[i] = byteString.charCodeAt(i);
        }
        return arrayBuffer;
        // var dataView = new DataView(arrayBuffer);
        // console.log(dataView);
    }
});
