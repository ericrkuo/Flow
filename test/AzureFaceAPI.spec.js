var chai = require("chai");
var sampleDataURL = require("./sampleDataURL");
const {NoUserDetectedError} = require("../controllers/Error");
const {AzureFaceAPI} = require("../controllers/AzureFaceAPI");

describe("unit test for dataURL", function () {

    before(function () {
        require('dotenv').config();
    });

    // it("test using chai expect ", function () {
    //     chai.expect(sampleDataURL.dataURL1).equal(sampleDataURL.dataURL1);
    // });

    it("call successful Azure Face API", function () {
        let azureFaceAPI = new AzureFaceAPI();
        return azureFaceAPI.getEmotions(sampleDataURL.dataURL1).then((res)=>{
            console.log(res);
            chai.assert(true);
        }).catch((err) => {
            console.log(err);
            chai.expect.fail("not supposed to fail");
        });
    });

    it("No user detected in image - expecting failure", function () {
        let azureFaceAPI = new AzureFaceAPI();
        return azureFaceAPI.getEmotions(sampleDataURL.emptyDataURL).then((res)=>{
            chai.expect.fail("Should have failed");
        }).catch((err) => {
            console.log(err);
            chai.expect(err).to.be.instanceOf(NoUserDetectedError);
        });
    });

    it("Invalid Data URL - expecting failure", function () {
        let azureFaceAPI = new AzureFaceAPI();
        return azureFaceAPI.getEmotions("").then((res)=>{
            chai.expect.fail("Should have failed");
        }).catch((err) => {
            console.log(err);
        });
    });
});
