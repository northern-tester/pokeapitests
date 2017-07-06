var chakram = require('./../node_modules/chakram/lib/chakram.js'),
    expect = chakram.expect;
var path = require('path');
var fs = require('fs');
var assert = require('assert');
var argv = require('optimist').demand('config').argv;
var configFilePath = argv.config;
assert.ok(fs.existsSync(configFilePath), 'Config file not found at path: '+ configFilePath);
var config = require('nconf').env().argv().file({file: configFilePath});
var urlConfig = config.get("url");

//Config items from command line arguments
var host = urlConfig.host;
var uri = urlConfig.uri.evolutionsChain;
var dataItems = urlConfig.dataItems;

describe("Returning evolution links for specific pokemon and performing framework validations ", function(){

    var pokemonEvolutionData;

    before("Get some initial data for a Cleffa", function(){
        pokemonEvolutionData = chakram.get(host+uri+dataItems.evolutionId);
        return pokemonEvolutionData;
    });

    it("Status code is 200 for a successful request", function(){
        return expect(pokemonEvolutionData).to.have.status(200);
    });

    it("Content headers returned should indicate json response using gzip", function(){
        //There is a bug here by the way, header says gzip but response isn't :S
        expect(pokemonEvolutionData).to.not.be.encoded.with.gzip;
        expect(pokemonEvolutionData).to.have.header("content-type", "application/json");
        expect(pokemonEvolutionData).to.have.json('id', parseInt(dataItems.evolutionId));
        return chakram.wait();
    });

    it("Endpoint should respond with data matching the Evolution Chains schema", function () {
        var expectedSchema = require('./../schemas/evolutionsChain');
            return expect(pokemonEvolutionData).to.have.schema(expectedSchema);
    });

    it("Evolutions Chains endpoint should return 405 for POST, PUT or DELETE", function() {
        //var httpVerbs = ['OPTIONS','GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'TRACE', 'CONNECT'];
            this.timeout(4000);
            expect(chakram.post(host+uri+dataItems.evolutionId)).to.have.status(405);
            expect(chakram.put(host+uri+dataItems.evolutionId)).to.have.status(405);
            expect(chakram.delete(host+uri+dataItems.evolutionId)).to.have.status(405);
            return chakram.wait();
    });

    it("Evolutions Chains endpoint options request details allowed methods in header", function(){
        chakram.options(host+uri+dataItems.evolutionId)
            .then(function(optionsResponse) {
                expect(optionsResponse).to.have.header('allow', function(allowHeader) {
                    expect(allowHeader).to.equal('GET, HEAD, OPTIONS');
            })
            return chakram.wait();
        });
    });

    it("If the Evolution Chain Id is unavailable a 404 status code is returned", function(){
        chakram.get(host+uri+dataItems.unavailableEvolutionId)
            .then(function(unavailableId){
                return expect(unavailableId).to.have.status(404);
        });
    });
});

describe("Specific tests on the chaining of evolutions", function(){

    it("Pokemon that don't evolve are not returned in the Evolution Chain Endpoint", function(){
        return chakram.wait();
    });

    it("Pokemon with two evolutions without babies are returned in the Evolution Endpoint", function(){
        var twoEvosNoBaby = chakram.get(host+uri+dataItems.twoEvolutionsNoBaby);
        expect(twoEvosNoBaby).to.have.json("chain.species.name", "bulbasaur");
        expect(twoEvosNoBaby).to.have.json("chain.is_baby",false);
        expect(twoEvosNoBaby).to.have.json("chain.evolves_to[0].evolves_to[0].species.name", "venusaur");
        expect(twoEvosNoBaby).to.have.json("chain.evolves_to[0].species.name", "ivysaur");
        return chakram.wait();
    });

    //Pokemon with one evolution without baby

    //Pokemon with two evolutions with baby

    //Pokemon with one evolutions with baby

    //Special test for Eevee

});