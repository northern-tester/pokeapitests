function chakramLogger(chakramResponse){
    var logger = "\n The URL you requested was: \n"+chakramResponse.url+
                "\nThe body of your request contains: \n"+chakramResponse.body+
                "\nResponse in Milliseconds \n"+chakramResponse.responseTime;
    console.log(logger); 
}

module.exports = chakramLogger();