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

describe("Retrieve national pokedex entries", function () {

    var pokedexData;

    before("Retrieve the national pokedex", function(){
        pokedexData = chakram.get(host+uri);
    });

        it("National pokedex list returns 200 Response Code", function(){
            return expect(pokedexData).to.have.status(200);
        });

        it("National pokedex endpoint returns header indicating content type of json", function() {
            expect(pokedexData).to.be.encoded.with.gzip;
            expect(pokedexData).to.have.header("content-type", "application/json");
            expect(pokedexData).to.have.json('name', 'national');
            return chakram.wait();
        });

        it("National pokedex conforms to schema", function () {
            var expectedSchema = require('./../schemas/nationalPokedex');
                return expect(pokedexData).to.have.schema(expectedSchema);
        });

        it("National pokedex endpoint should return 405 for POST, PUT or DELETE", function() {
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
                        return expect(allowHeader).to.equal('GET, HEAD, OPTIONS');
                });
            });
        });

});

describe("Specific tests for the national pokedex endpoint", function(){

    before("Retrieve the national pokedex", function(){
        pokedexData = chakram.get(host+uri);
    });

        it("National pokedex has 721 pokemon entries for all Pokemon in all regions", function(){
            return expect(pokedexData).to.have.json('pokemon_entries', function(pokemonArray){
                expect(pokemonArray).to.have.length(721);
            });
        });
        
});