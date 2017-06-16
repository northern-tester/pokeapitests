var chakram = require('./../node_modules/chakram/lib/chakram.js'),
    expect = chakram.expect;

var environments = require('../config/environments.json');
var endpoints = require('../config/endpoints.json');

describe("Retrieve Pokedex Entries", function () {

    var environment, endpoint;

    before("Initialise your environment and endpoint before getting data", function(){
        environment = environments.live;
        endpoint = endpoint.pokedex;
    }) 

})