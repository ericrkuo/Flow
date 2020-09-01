var chai = require("chai");
var sampleDataURL = require("./sampleDataURL");
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
});
