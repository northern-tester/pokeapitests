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

describe("Retrieve Regional pokedexes", function(){

    var pokedexData;

    before("Get Data", function(){ 
        //Get Pokedex Data
        pokedexData = chakram.get(host+uri);
    });

    //Assert against response code
    it("Regional Pokedex List Returns 200 Response Code", function() {
        return expect(pokedexData).to.have.status(200);
    });

    //Assert that the content-type header is set to application/json
    it("should return header indicating content type of json", function() {
        return expect(pokedexData).to.have.header("content-type", "application/json");
    });

    //Assert against number of regional pokedexes
    it("Regional Pokedex List Returns 14 Pokedexes", function() {
        return expect(pokedexData).to.have.json('results', function(pokemonArray){
            expect(pokemonArray).to.have.length(14);
        });
    })

    //Assert against schema
    it("Regional Pokedex List Conforms to Schema", function(){
        var expectedSchema = {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "definitions": {},
                "id": "http://example.com/example.json",
                "properties": {
                    "count": {
                        "id": "/properties/count",
                        "type": "integer"
                    },
                    "next": {
                        "id": "/properties/next",
                        "type": "null"
                    },
                    "previous": {
                        "id": "/properties/previous",
                        "type": "null"
                    },
                    "results": {
                        "id": "/properties/results",
                        "items": {
                            "id": "/properties/results/items",
                            "properties": {
                                "name": {
                                    "id": "/properties/results/items/properties/name",
                                    "type": "string"
                                },
                                "url": {
                                    "id": "/properties/results/items/properties/url",
                                    "type": "string"
                                }
                            },
                            "type": "object"
                        },
                        "type": "array"
                    }
                },
                "type": "object"
            };
            return expect(pokedexData).to.have.schema(expectedSchema);
    });

    //Assert against a region which doesn't exist
    it("If Regional Pokedex Number Doesnt Exist Error Returned", function() {
        var uri = urlConfig.invalidPokedex;
        var regionalPokedexError = chakram.get(host+uri);
        return expect(regionalPokedexError).to.have.status(404);
    });

    // it("Get All Regional Pokedexes and Check Their Contents", function(){
    //         expect(pokedexData).to.have.json('results', function(regionalURLArray){
    //             regionalURLArray.forEach(function(element) {
    //                 var regionalPokedexURL = element.url;
    //                 return regionalPokedexURL;
    //         }).then(function(regionalPokedexURL) {
    //                 var regionalPokedex = chakram.get(regionalPokedexURL);
    //                 return regionalPokedex;
    //         }).then(function(regionalPokedex){
    //                 expect(regionalPokedex).to.have.json('name', element.name);
    //                 return chakram.wait();
    //       });
    //    });
    // });

    it("Check All Regional Pokedexes from the National Pokedex List", function() {   
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
});