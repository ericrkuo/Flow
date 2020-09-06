var chai = require("chai");
var sampleDataURL = require("./sampleDataURL");
const Err = require("../controllers/Error");
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");

let azureFaceAPI;
describe("unit test for dataURL", function () {

    before(function () {
        require('dotenv').config();
        azureFaceAPI = new AzureFaceAPI();
    });

    it("test getEmotions - call successful Azure Face API", function () {
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
        return azureFaceAPI.getEmotions(null)
            .then(() => {
                chai.expect.fail("supposed to fail");
            }).catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getEmotions - wrong input type", function () {
        return azureFaceAPI.getEmotions(2)
            .then(() => {
                chai.expect.fail("supposed to fail");
            }).catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.InvalidInputError);
            });
    });

    it("test getEmotions - invalid dataURL string", function () {
        return azureFaceAPI.getEmotions("null")
            .then(() => {
                chai.expect.fail("supposed to fail");
            }).catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.AzureFaceApiError);
            });
    });

    it("test getEmotions - no user detected in image", function () {
        return azureFaceAPI.getEmotions(sampleDataURL.emptyDataURL)
            .then((res) => {
                chai.expect.fail("supposed to fail");
            }).catch((err) => {
                console.log(err);
                chai.expect(err).to.be.instanceOf(Err.NoUserDetectedError);
            });
    });

    it("test getEmotions - multiple face data URL", function () {
        return azureFaceAPI.getEmotions(sampleDataURL.multiFaceDataURL)
            .then((res) => {
                let maxEmotion, maxVal = -1;
                for (const [emotion, val] of Object.entries(res)) {
                    if (val > maxVal) {
                        maxVal = val;
                        maxEmotion = emotion;
                    }
                }

                chai.expect(maxEmotion).to.be.equal("fear");
            }).catch((err) => {
                console.log(err);
                chai.expect.fail("not supposed to fail");
            });
    });

    it("test handleAzureFaceAPIResponse - response null input", function () {
        try {
            azureFaceAPI.handleAzureFaceAPIResponse(null);
            chai.expect.fail("supposed to fail");
        } catch (e) {
            chai.expect(e).to.be.instanceOf(Err.InvalidResponseError);
        }
    });

    it("test handleAzureFaceAPIResponse - response undefined input", function () {
        try {
            azureFaceAPI.handleAzureFaceAPIResponse(undefined);
            chai.expect.fail("supposed to fail");
        } catch (e) {
            chai.expect(e).to.be.instanceOf(Err.InvalidResponseError);
        }
    });

    it("test handleAzureFaceAPIResponse - no response.data", function () {
        try {
            azureFaceAPI.handleAzureFaceAPIResponse({dataa: 2});
            chai.expect.fail("supposed to fail");
        } catch (e) {
            chai.expect(e).to.be.instanceOf(Err.InvalidResponseError);
        }
    });

    it("test handleAzureFaceAPIResponse - response.data invalid type", function () {
        try {
            azureFaceAPI.handleAzureFaceAPIResponse({data: 2});
            chai.expect.fail("supposed to fail");
        } catch (e) {
            chai.expect(e).to.be.instanceOf(Err.InvalidResponseError);
        }
    });

    it("test handleAzureFaceAPIResponse - response.data array empty", function () {
        try {
            azureFaceAPI.handleAzureFaceAPIResponse({data: []});
            chai.expect.fail("supposed to fail");
        } catch (e) {
            chai.expect(e).to.be.instanceOf(Err.NoUserDetectedError);
        }
    });

    it("test handleAzureFaceAPIResponse - response.data[0] no face attributes", function () {
        try {
            azureFaceAPI.handleAzureFaceAPIResponse({data: [{faceAttributesMISPELLED: 0}]});
            chai.expect.fail("supposed to fail");
        } catch (e) {
            chai.expect(e).to.be.instanceOf(Err.InvalidResponseError);
        }
    });

    it("test handleAzureFaceAPIResponse - response.data[0].faceAttributes no emotion", function () {
        try {
            azureFaceAPI.handleAzureFaceAPIResponse({data: [{faceAttributes: {emotionMISPELLED: 0}}]});
            chai.expect.fail("supposed to fail");
        } catch (e) {
            chai.expect(e).to.be.instanceOf(Err.InvalidResponseError);
        }
    });

    it("test handleAzureFaceAPIResponse", function () {
        try {
            let emotion = {
                anger: 0, contempt: 0, disgust: 0, fear: 0, happiness: 0, neutral: 0.999, sadness: 0, surprise: 0
            };
            let result = azureFaceAPI.handleAzureFaceAPIResponse({
                data: [{faceAttributes: {emotion: emotion}}]
            });
            chai.expect(JSON.stringify(result)).to.be.equal(JSON.stringify(emotion));
        } catch (e) {
            chai.expect.fail("not supposed to fail");
        }
    });
});
