var chai = require("chai");
const request = require('request');
const {Main} = require("../controllers/Main");

let main;
describe("unit test for Main", function () {
    before(function () {
        main = new Main("myDATAURL"); //TODO: fix
        require('dotenv').config();
    });

    it("testing Main function", async function(){
        let resp = await main.getRelevantSongsTestingPurposes();
    })

});
