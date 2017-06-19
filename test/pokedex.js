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

    it("should respond with data matching the Pokedex schema", function () {
        var expectedSchema = {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "definitions": {},
                "id": "http://example.com/example.json",
                "properties": {
                    "descriptions": {
                        "id": "/properties/descriptions",
                        "items": {
                            "id": "/properties/descriptions/items",
                            "properties": {
                                "description": {
                                    "id": "/properties/descriptions/items/properties/description",
                                    "type": "string"
                                },
                                "language": {
                                    "id": "/properties/descriptions/items/properties/language",
                                    "properties": {
                                        "name": {
                                            "id": "/properties/descriptions/items/properties/language/properties/name",
                                            "type": "string"
                                        },
                                        "url": {
                                            "id": "/properties/descriptions/items/properties/language/properties/url",
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                }
                            },
                            "type": "object"
                        },
                        "type": "array"
                    },
                    "id": {
                        "id": "/properties/id",
                        "type": "integer"
                    },
                    "is_main_series": {
                        "id": "/properties/is_main_series",
                        "type": "boolean"
                    },
                    "name": {
                        "id": "/properties/name",
                        "type": "string"
                    },
                    "names": {
                        "id": "/properties/names",
                        "items": {
                            "id": "/properties/names/items",
                            "properties": {
                                "language": {
                                    "id": "/properties/names/items/properties/language",
                                    "properties": {
                                        "name": {
                                            "id": "/properties/names/items/properties/language/properties/name",
                                            "type": "string"
                                        },
                                        "url": {
                                            "id": "/properties/names/items/properties/language/properties/url",
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                },
                                "name": {
                                    "id": "/properties/names/items/properties/name",
                                    "type": "string"
                                }
                            },
                            "type": "object"
                        },
                        "type": "array"
                    },
                    "pokemon_entries": {
                        "id": "/properties/pokemon_entries",
                        "items": {
                            "id": "/properties/pokemon_entries/items",
                            "properties": {
                                "entry_number": {
                                    "id": "/properties/pokemon_entries/items/properties/entry_number",
                                    "type": "integer"
                                },
                                "pokemon_species": {
                                    "id": "/properties/pokemon_entries/items/properties/pokemon_species",
                                    "properties": {
                                        "name": {
                                            "id": "/properties/pokemon_entries/items/properties/pokemon_species/properties/name",
                                            "type": "string"
                                        },
                                        "url": {
                                            "id": "/properties/pokemon_entries/items/properties/pokemon_species/properties/url",
                                            "type": "string"
                                        }
                                    },
                                    "type": "object"
                                }
                            },
                            "type": "object"
                        },
                        "type": "array"
                    },
                    "region": {
                        "id": "/properties/region",
                        "type": "null"
                    },
                    "version_groups": {
                        "id": "/properties/version_groups",
                        "items": {},
                        "type": "array"
                    }
                },
                "type": "object"
            };
            return expect(pokedexData).to.have.schema(expectedSchema);
    });


});