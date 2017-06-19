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
var uri = urlConfig.uri.pokedex;

describe("Retrieve Pokedex Entries", function () {

    var pokedexData;

    before("Initialise your environment and endpoint before getting data", function(){
        //Get Pokedex Data
        pokedexData = chakram.get(host+uri);
    });

    //Assert against response code
    it("should return 200 on success", function(){
        return expect(pokedexData).to.have.status(200);
    });

    it("should return header indicating content type of json", function() {
        return expect(pokedexData).to.have.header("content-type", "application/json");
    });

    // it("should respond with data matching the Pokedex schema", function () {
    //     var expectedSchema = {

    //     }
    // })


});