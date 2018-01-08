'use strict';

const config = require('../config/config.js');
const express = require('express');
const Inversoft = require('passport-node-client');
const router = express.Router();
let passportClient = new Inversoft.PassportClient(config.passport.apiKey, config.passport.backendUrl);

// Return the Passport Configuration
router.route('/passport/config').get((req, res) => {
  delete config.passport.apiKey;
  res.send(config.passport);
});

// Register a new user
router.route('/passport/register').post((req, res) => {
  // Fill out the registration part of the request but use the default roles
  let request = {
    user: req.body.user,
    registration: {
      applicationId: config.passport.applicationId
    },
    skipVerification: true
  };

  passportClient.register(null, request)
    .then((response) => {
      res.send(response.successResponse);
    })
    .catch((response) => {
      res.status(response.statusCode).send(response.errorResponse);
    });
});

router.route('/passport/webhook').post((req, res) => {
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
