'use strict';

const config = require('../config/config.js');
const express = require('express');
const FusionAuth = require('fusionauth-node-client');
const router = express.Router();
let client = new FusionAuth.FusionAuthClient(config.fusionauth.apiKey, config.fusionauth.applicationURL);

// Return the FusionAuth Configuration
router.route('/fusionauth/config').get((req, res) => {
  delete config.fusionauth.apiKey;
  res.send(config.fusionauth);
});

// Register a new user
router.route('/fusionauth/register').post((req, res) => {
  // Fill out the registration part of the request but use the default roles
  let request = {
    user: req.body.user,
    registration: {
      applicationId: config.fusionauth.applicationId
    },
    skipVerification: true
  };

  client.register(null, request)
    .then((response) => {
      res.send(response.successResponse);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response.errorResponse);
    });
});

router.route('/fusionauth/webhook').post((req, res) => {
  const authorization = req.header('Authorization');
  if (authorization !== 'API-KEY') {
    res.status(403).send({
      'errors': [{
        'code': '[notAuthorized]'
      }]
    });
    return;
  }

  res.sendStatus(200);
});

module.exports = router;
