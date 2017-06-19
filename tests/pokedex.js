var chakram = require('./../node_modules/chakram/lib/chakram.js'),
    expect = chakram.expect;

var environment = require('../config/environments').live;
var endpoint = require('../config/endpoints').pokedex;

describe("Retrieve Pokedex Entries", function () {

    var pokedexData;

    before("Initialise your environment and endpoint before getting data", function(){
        //Get Pokedex Data
        pokedexData = chakram.get(environment+endpoint);
    });

    //Assert against response code
    it("should return 200 on success", function(){
        return expect(pokedexData).to.have.status(200);
    });

    it("should return header indicating content type of json", function() {
        return expect(pokedexData).to.have.header("content-type", "application/json");
    });


});