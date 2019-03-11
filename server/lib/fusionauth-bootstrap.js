'use strict';

const FusionAuth = require('fusionauth-node-client');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./passport');
const config = require("../config/config.js");

// Build a Passport REST Client
let client = new FusionAuth.FusionAuthClient(config.fusionauth.apiKey, config.fusionauth.applicationURL);

console.info('FusionAuth Bootstrap in mode [' + config.mode + ']');

// Outside of this example application, this would normally be done once in FusionAuth and not in code.
// Make sure that the application, roles and configuration is setup in FusionAuth
client.retrieveApplication(config.fusionauth.applicationId)
  .catch((clientResponse) => {
    if (clientResponse.statusCode === 404) {
      client.createApplication(config.fusionauth.applicationId, {
          "application": {
            "name": "Example Application",
            "roles": [
              {
                "name": "user",
                "isDefault": true,
                "description": "Basic user account"
              }
            ]
          }
        })
        .catch((innerClientResponse) => console.error(`Unable to initialize FusionAuth (Create Application). Please check that FusionAuth is installed, running and not in maintenance mode. Status code from FusionAuth was [${innerClientResponse.statusCode}]. Error response from FusionAuth was [${JSON.stringify(innerClientResponse.errorResponse)}]`));
    } else {
      console.error(`Unable to initialize FusionAuth (Retrieve Application). Please check that FusionAuth is installed, running and not in maintenance mode. Status code from FusionAuth was [${clientResponse.statusCode}]. Error response from FusionAuth was [${JSON.stringify(clientResponse.errorResponse)}]`);
    }
  });

// If running in development, set up some configuration for FusionAuth.
// Outside of this example application, this would normally be done once in FusionAuth and not in code.
if (config.mode === 'development') {
  client.retrieveSystemConfiguration()
    .then((clientResponse) => {
      const systemConfiguration = clientResponse.successResponse.systemConfiguration;

      systemConfiguration.reportTimezone = "America/Denver";
      systemConfiguration.emailConfiguration.verifyEmail = true;
      systemConfiguration.emailConfiguration.verifyEmailWhenChanged = true;
      systemConfiguration.emailConfiguration.forgotPasswordEmailTemplateId = config.fusionauth.forgotPasswordEmailTemplateId;
      systemConfiguration.emailConfiguration.verificationEmailTemplateId = config.fusionauth.verificationEmailTemplateId;

      client.updateSystemConfiguration({
        "systemConfiguration": systemConfiguration
      })
        .catch((clientResponse) => console.error(`Unable to initialize FusionAuth (Update System Config). Please check that FusionAuth is installed, running and not in maintenance mode. Status code from FusionAuth was [${clientResponse.statusCode}]. Error response from FusionAuth was [${JSON.stringify(clientResponse.errorResponse, null, '  ')}]`));

    })
    .catch((clientResponse) => console.error(`Unable to initialize FusionAuth (Retrieve System Config). Please check that FusionAuth is installed, running and not in maintenance mode. Status code from FusionAuth was [${clientResponse.statusCode}]. Error response from FusionAuth was [${JSON.stringify(clientResponse.errorResponse, null, 2)}]`));
}


// This could be done on startup, or when the System Configuration or Application Configuration is updated in FusionAuth.
// A webhook event would utilized to indicate these state changes, and then we can attempt to retrieve the updated public key.
//  -- Retrieve the public key during start up to decode and verify the JWT
client.retrieveJWTPublicKeys()
.then((clientResponse) => {
  if (clientResponse.successResponse.publicKeys.hasOwnProperty(config.fusionauth.applicationId)) {
    localStorage.publicKey = clientResponse.successResponse.publicKeys[config.fusionauth.applicationId];
  } else {
    console.info('Unable to retrieve JWT Public Key. Enable JWT configuration for the application and specify an RSA based algorithm.');
  }
})
.catch((clientResponse) => {
  console.info(`Unable to retrieve JWT Public Key. Status code from FusionAuth was [${clientResponse.statusCode}]. Error response from FusionAuth was [${JSON.stringify(clientResponse.errorResponse)}]`);
});
