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
var uri = urlConfig.uri.regionalPokedex;

describe("Returning metadata for specific regional pokedexes and performing framework validations", function(){

    var pokedexData;

    before("Retrieve the list of regional pokedexes", function(){ 
        pokedexData = chakram.get(host+uri);
    });

        it("Regional pokedex list returns 200 Response Code", function() {
            return expect(pokedexData).to.have.status(200);
        });

        it("Regional pokedex endpoint returns header indicating content type of json", function() {
            expect(pokedexData).to.be.encoded.with.gzip;
            expect(pokedexData).to.have.header("content-type", "application/json");
            expect(pokedexData).to.have.json('count', 14);
            return chakram.wait();
        });

        it("Regional pokedex list conforms to schema", function(){
            var expectedSchema = require('./../schemas/regionalPokedex');
                return expect(pokedexData).to.have.schema(expectedSchema);
        });

        it("Regional pokedex endpoint should return 405 for POST, PUT or DELETE", function() {
            this.timeout(4000);
            expect(chakram.post(host+uri)).to.have.status(405);
            expect(chakram.put(host+uri)).to.have.status(405);
            expect(chakram.delete(host+uri)).to.have.status(405);
            return chakram.wait();
        });

        it("Regional pokedex endpoint options request details allowed methods in header", function(){
            chakram.options(host+uri)
                .then(function(optionsResponse) {
                    expect(optionsResponse).to.have.header('allow', function(allowHeader) {
                        return expect(allowHeader).to.equal('GET, HEAD, OPTIONS');
                });
            });
        });

});

describe("Specific tests on regional pokedexes", function(){
    
    before("Retrieve the list of regional pokedexes", function(){ 
        pokedexData = chakram.get(host+uri);
    });

        it("Check all regional pokedexes from the national pokedex list", function() {   
            return chakram.get(host+uri)
                .then(function(pokedexResponse){
                    return expect(pokedexResponse).to.have.json('results', function(regionalURLArray){
                        regionalURLArray.forEach(function(element){
                            return chakram.get(element.url)
                                .then(function(regionalResponse){
                                    return expect(regionalResponse).to.have.status(200);
                        })
                    })
                })
            })
        });

        it("Regional Pokedex List Returns 14 Pokedexes", function() {
                return expect(pokedexData).to.have.json('results', function(pokemonArray){
                    expect(pokemonArray).to.have.length(14);
            });
        });

        it("If Regional Pokedex Number Doesnt Exist Error Returned", function() {
            var uri = urlConfig.invalidPokedex;
            var regionalPokedexError = chakram.get(host+uri);
            return expect(regionalPokedexError).to.have.status(404);
        });

});