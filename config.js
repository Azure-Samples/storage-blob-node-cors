
var storage = require('azure-storage');

function readConfig() {
    var config = {};
    config.connectionString = storage.generateDevelopmentStorageCredendentials();
    config.containerName = 'someimagescontainer';
    
    return config;
}

module.exports = readConfig();