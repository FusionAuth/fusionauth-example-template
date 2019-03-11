var request = require('request');
const configFile = require ('./config.json');

var configuration;

// Retrieve the FusionAuth Configuration
var baseURL = configFile.development.backend.url;
function retrieveConfiguration(callBack) {
  request.get(baseURL + '/api/fusionauth/config', function(err, res, body) {
    if (!err && res.statusCode === 200) {
        configFile.development.fusionauth = JSON.parse(body);
        configuration = configFile.development;

      if (callBack) {
        callBack(configuration);
      }
    } else {
      console.error(err);
      throw new Error('Unable to retrieve the FusionAuth configuration. [' + res.statusCode + ']');
    }
  });
}

module.exports = function(callBack) {
  if (typeof configuration === 'undefined') {
    retrieveConfiguration(callBack);
  } else {
    callBack(configuration);
  }
};



