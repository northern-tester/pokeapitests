var chakram = require('./../node_modules/chakram/lib/chakram.js'),
    expect = chakram.expect;
var path = require('path');
var fs = require('fs');
var assert = require('assert');
var argv = require('optimist').demand('config').argv;
var configFilePath = argv.config;
assert.ok(fs.existsSync(configFilePath), 'Config file not found at path: '+ configFilePath);
var config = require('nconf').env().argv().file({file: configFilePath});
var urlConfig = config.get("url")
var host = urlConfig.host;
var uri = urlConfig.uri.nationalPokedex;

describe("Retrieve National Pokedex Entries", function () {

    var pokedexData;

    before("Initialise your environment and endpoint before getting data", function(){
        //Get Pokedex Data
        pokedexData = chakram.get(host+uri);
    });

    //Assert against response code
    it("should return 200 response code", function(){
        return expect(pokedexData).to.have.status(200);
    });

    //Assert that the content-type header is set to application/json
    it("should return header indicating content type of json", function() {
        return expect(pokedexData).to.have.header("content-type", "application/json");
    });

    //Assert that the schema from the response matches the PokeAPI oracle
    it("should respond with data matching the Pokedex schema", function () {
        var expectedSchema = require('./../schemas/nationalPokedex');
            return expect(pokedexData).to.have.schema(expectedSchema);
    });

    it("should return 721 pokemon entries for all Pokemon in all regions", function(){
        return expect(pokedexData).to.have.json('pokemon_entries', function(pokemonArray){
            expect(pokemonArray).to.have.length(721);
        });
    });

    it("should have only the GET on the National Pokedex endpoint", function() {
        //var httpVerbs = ['OPTIONS','GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];
            //Its a GET only endpoint but supports OPTIONS and others
            this.timeout(4000);
            expect(chakram.post(host+uri)).to.have.status(405);
            expect(chakram.put(host+uri)).to.have.status(405);
            expect(chakram.delete(host+uri)).to.have.status(405);
            return chakram.wait();
    });

    it("should return list of supported methods from an OPTIONS call", function(){
        chakram.options(host+uri)
            .then(function(optionsResponse) {
                expect(optionsResponse).to.have.header('allow', function(allowHeader) {
                    expect(allowHeader).to.equal('GET, HEAD, OPTIONS');
            })
            return chakram.wait();
        });
    });
});