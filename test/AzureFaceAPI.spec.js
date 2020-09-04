var chai = require("chai");
var sampleDataURL = require("./sampleDataURL");
const {InvalidResponseError, NoUserDetectedError, InvalidInputError} = require("../controllers/Error");
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");

let azureFaceAPI;
describe("unit test for dataURL", function () {

    before(function () {
        require('dotenv').config();
        azureFaceAPI = new AzureFaceAPI();
    });

    it("call successful Azure Face API", function () {
        return azureFaceAPI.getEmotions(sampleDataURL.dataURL1)
            .then((res) => {
                console.log(res);
                chai.assert(typeof res === 'object' && !Array.isArray(res));
            }).catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("test getEmotions - null input", function () {
        try {
            return azureFaceAPI.getEmotions(null)
                .then((res) => {
                    chai.expect.fail();
                });
        } catch (err) {
            console.log(err);
            chai.expect(err).to.be.instanceOf(InvalidInputError);
        }
    });

    it("test getEmotions - wrong input type", function () {
        try {
            return azureFaceAPI.getEmotions(2)
                .then((res) => {
                    chai.expect.fail();
                });
        } catch (err) {
            console.log(err);
            chai.expect(err).to.be.instanceOf(InvalidInputError);
        }
    });

    it("No user detected in image - expecting failure", function () {
        return azureFaceAPI.getEmotions(sampleDataURL.emptyDataURL)
            .then((res) => {
                chai.expect.fail("Should have failed");
            }).catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(NoUserDetectedError);
            });
    });

    it("test handleResponse - response null input", function () {
        try {
            azureFaceAPI.handleResponse(null);
            chai.expect.fail();
        } catch (e) {
            chai.expect(e).to.be.instanceOf(InvalidResponseError);
        }
    });

    it("test handleResponse - response undefined input", function () {
        try {
            azureFaceAPI.handleResponse(undefined);
            chai.expect.fail();
        } catch (e) {
            chai.expect(e).to.be.instanceOf(InvalidResponseError);
        }
    });

    it("test handleResponse - no response.data", function () {
        try {
            azureFaceAPI.handleResponse({dataa: 2});
            chai.expect.fail();
        } catch (e) {
            chai.expect(e).to.be.instanceOf(InvalidResponseError);
        }
    });

    it("test handleResponse - response.data invalid type", function () {
        try {
            azureFaceAPI.handleResponse({data: 2});
            chai.expect.fail();
        } catch (e) {
            chai.expect(e).to.be.instanceOf(InvalidResponseError);
        }
    });

    it("test handleResponse - response.data array empty", function () {
        try {
            azureFaceAPI.handleResponse({data: []});
            chai.expect.fail();
        } catch (e) {
            chai.expect(e).to.be.instanceOf(NoUserDetectedError);
        }
    });

    it("test handleResponse - response.data[0] no face attributes", function () {
        try {
            azureFaceAPI.handleResponse({data: [{faceAttributesMISPELLED: 0}]});
            chai.expect.fail();
        } catch (e) {
            chai.expect(e).to.be.instanceOf(InvalidResponseError);
        }
    });

    it("test handleResponse - response.data[0].faceAttributes no emotion", function () {
        try {
            azureFaceAPI.handleResponse({data: [{faceAttributes: {emotionMISPELLED: 0}}]});
            chai.expect.fail();
        } catch (e) {
            chai.expect(e).to.be.instanceOf(InvalidResponseError);
        }
    });

    it("test handleResponse", function () {
        try {
            let emotion = {
                anger: 0, contempt: 0, disgust: 0, fear: 0, happiness: 0, neutral: 0.999, sadness: 0, surprise: 0
            };
            let result = azureFaceAPI.handleResponse({
                data: [{faceAttributes: {emotion: emotion}}]
            });
            chai.expect(JSON.stringify(result)).to.be.equal(JSON.stringify(emotion));
        } catch (e) {
            chai.expect.fail();
        }
    });
});
