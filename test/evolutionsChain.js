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

//Config items from command line arguments
var host = urlConfig.host;
var uri = urlConfig.uri.evolutionsChain;
var cleffaId = urlConfig.dataItems.cleffaEvolutionChainId; 

describe("Returning evolution links for specific pokemon and performing framework validations ", function(){

    var pokemonEvolutionData;

    before("Get some initial data for a Cleffa", function(){
        pokemonEvolutionData = chakram.get(host+uri+cleffaId); 
    });

    //Status Code Returned for Success
    it("Status code is 200 for a successful request", function(){
        return expect(pokemonEvolutionData).to.have.status(200);
    });

    //Expected headers

    //Schema Validation

    //Available methods on that endpoint

});

describe("Specific tests on the chaining of evolutions", function(){

    //Pokemon with no evolutions

    //Pokemon with two evolutions with baby

    //Pokemon with three evolutions with baby

    //Pokemon with two evolutions without baby

    //Pokemon with three evolutions without baby

    //Special test for Eevee

    //


});