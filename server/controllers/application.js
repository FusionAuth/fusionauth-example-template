'use strict';

const config = require('../config/config.js');
const express = require('express');
const jwt = require('../lib/jwt');
const router = express.Router();

router.route('/application').get((req, res) => {
  const decodedJWT = _decodeJWT(req);
  if (!_authorized(decodedJWT, 'user')) {
    _sendUnauthorized(res);
    return;
  }

  res.status(200).send({
    'message': 'You have successfully authenticated and are logged into your application.'
  });
});

/**
 * Return true if the request is authorized. Verify the user has the correct role, and the JWT is for the requested
 * application.
 *
 * @param {Object} decodedJWT The decoded JWT
 * @param {string} role The required role to be authorized to complete the request
 * @returns {boolean}
 * @private
 */
function _authorized(decodedJWT, role) {
  if (decodedJWT === null) {
    return false;
  }

  if (!jwt.assertIdentity(decodedJWT, 'roles', role)) {
    return false;
  }

  if (!jwt.assertIdentity(decodedJWT, 'applicationId', config.passport.applicationId)) {
    return false;
  }

  return true;
}

/**
 * Decode the JWT by extracting the JWT from the HTTP request header.
 *
 * @param {Object} req The HTTP request
 * @returns {Object} the decoded JWT or null if the JWT was not found on the request or it is invalid.
 * @private
 */
function _decodeJWT(req) {
  const authorization = req.header('Authorization');
  if (authorization === null || typeof authorization === 'undefined') {
    return null;
  }

  const encodedJWT = authorization.substr('JWT '.length);
  if (encodedJWT === null || typeof encodedJWT === 'undefined') {
    return null;
  }

  return jwt.decode(encodedJWT);
}

/**
 * Set the HTTP Response with a status code of 403 and a response body indicating the user is not authorized to
 * complete the action.
 * @param {Object} res The HTTP Response
 * @private
 */
function _sendUnauthorized(res) {
  res.status(403).send({
    'errors': [{
      'code': '[notAuthorized]'
    }]
  });
}

module.exports = router;
