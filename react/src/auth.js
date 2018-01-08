const configuration = require("../config/config.js");
import Fingerprint2 from 'fingerprintjs2';

const auth = {
  login(email, password, callBack) {
    callBack = arguments[arguments.length - 1];
    if (localStorage.access_token) {
      if (callBack) {
        callBack(200);
      }
      return;
    }
    this._callLogin(email, password, callBack);
  },

  retrieveUser(encodedJWT, callBack) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = (function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          if (xhr.status === 400) {
            console.info('fail [' + xhr.status + ']');
          } else {
            console.info('fail [' + xhr.status + ']');
          }
        } else {
          // try to get a name out of the user response.
          const user = JSON.parse(xhr.responseText).user;
          this._writeLocalStorage(user);
          if (callBack) {
            callBack();
          }
        }
      }
    }).bind(this);

    configuration(function(config) {
      xhr.open('GET', config.passport.backendUrl + '/api/user', true);
      xhr.setRequestHeader('Authorization', 'JWT ' + encodedJWT);
      xhr.send();
    });

  },

  logout(callBack) {
    delete localStorage.access_token;
    delete localStorage.user;
    if (callBack) {
      callBack();
    }
  },

  loggedIn() {
    return !!localStorage.access_token;
  },

  register(email, password, firstName, lastName, callBack) {
    const requestBody = {
      user: {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
      }
    };

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          this._handleErrors(xhr, callBack, ['user.username']);
        } else {
          // After a successful registration, log the user in
          this.login(email, password, (status, response) => {
            if (status === 200) {
              localStorage.access_token = response.token;
              if (callBack) {
                callBack(xhr.status);
              }
            }
          });
        }
      }
    }).bind(this);

    configuration(function(config) {
      xhr.open('POST', config.backend.url + '/api/passport/register', true);
      xhr.setRequestHeader("Content-type", "application/json");

      const jsonRequest = JSON.stringify(requestBody);
      xhr.send(jsonRequest);
    });

  },

  completeTwoFactorLogin(code, twoFactorId, callBack) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 404) {
          const errors = [];
          errors.push('[InvalidLogin]');
          callBack(xhr.status, errors);
        } else if (xhr.status === 409) {
          callBack(xhr.status, []);
        } else if (xhr.status < 200 || xhr.status > 299) {
          this._handleErrors(xhr, callBack, []);
        } else {
          // Success, parse the response and grab the token and then retrieve the user to get their name.
          // 212 indicates email has not yet been verified.
          if (xhr.status === 200 || xhr.status === 212) {
            const successResponse = JSON.parse(xhr.responseText);
            if (callBack) {
              this._writeLocalStorage(successResponse.user);
              callBack(xhr.status, successResponse);
            }
          } else if (xhr.status === 203) {
            // change password required
          } else if (xhr.status === 242) {
            // 2FA challenge
            const successResponse = JSON.parse(xhr.responseText);
            callBack(xhr.status, successResponse);
          } else {
            if (callBack) {
              callBack(xhr.status);
            }
          }
        }
      }
    }).bind(this);

    // Generate a local unique device Id and keep it in local storage so we don't regenerate it often.
    if (!localStorage.device) {
      new Fingerprint2().get(function(result) {
        localStorage.device = result;
      });
    }

    configuration(function(config) {
      const loginRequest = {
        code: code,
        applicationId: config.passport.applicationId,
        device: localStorage.device,
        metaData: {
          device: {
            description: navigator.userAgent,
            type: 'BROWSER',
            name: 'Passport Example'
          }
        },
        twoFactorId: twoFactorId
      };
      xhr.open('POST', config.passport.backendUrl + '/api/two-factor/login', true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify(loginRequest));
    });

  },

  _callToken(email, password, callBack) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status < 200 || xhr.status > 299) {
          this._handleErrors(xhr, callBack, []);
        } else {
          // Success, parse the response and grab the token and then retrieve the user to get their name.
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            this.retrieveUser(response.access_token, () => {
              if (callBack) {
                callBack(xhr.status, response);
              }
            });
          } else {
            if (callBack) {
              callBack(xhr.status);
            }
          }
        }
      }
    }).bind(this);

    configuration(function(config) {
      const data = new FormData();
      data.append('loginId', email);
      data.append('password', password);
      data.append('grant_type', 'password');
      data.append('client_id', config.passport.applicationId);

      xhr.open('POST', config.passport.backendUrl + '/oauth2/token', true);
      xhr.send(data);
    });

  },

  _callLogin(email, password, callBack) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 404) {
          const errors = [];
          errors.push('[InvalidLogin]');
          callBack(xhr.status, errors);
        } else if (xhr.status === 409) {
          callBack(xhr.status, []);
        } else if (xhr.status < 200 || xhr.status > 299) {
          this._handleErrors(xhr, callBack, []);
        } else {
          // Success, parse the response and grab the token and then retrieve the user to get their name.
          // 212 indicates email has not yet been verified.
          if (xhr.status === 200 || xhr.status === 212) {
            const successResponse = JSON.parse(xhr.responseText);
            if (callBack) {
              this._writeLocalStorage(successResponse.user);
              callBack(xhr.status, successResponse);
            }
          } else if (xhr.status === 203) {
            // change password required
          } else if (xhr.status === 242) {
            // 2FA challenge
            const successResponse = JSON.parse(xhr.responseText);
            callBack(xhr.status, successResponse);
          } else {
            if (callBack) {
              callBack(xhr.status);
            }
          }
        }
      }
    }).bind(this);

    // Generate a local unique device Id and keep it in local storage so we don't regenerate it often.
    if (!localStorage.device) {
      new Fingerprint2().get(function(result) {
        localStorage.device = result;
      });
    }

    configuration(function(config) {
      const loginRequest = {
        loginId: email,
        password: password,
        applicationId: config.passport.applicationId,
        device: localStorage.device,
        metaData: {
          device: {
            description: navigator.userAgent,
            type: 'BROWSER',
            name: 'Passport Example'
          }
        }
      };
      xhr.open('POST', config.passport.backendUrl + '/api/login', true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify(loginRequest));
    });

  },

  _handleErrors(xhr, callBack, ignoredFields) {
    if (xhr.status === 400) {
      const errors = [];
      const errorResponse = JSON.parse(xhr.responseText);
      this._parseErrors(errorResponse, errors, ignoredFields || []);

      if (callBack) {
        callBack(xhr.status, errors);
      }
    } else {
      console.info('fail [' + xhr.status + ']');
      if (callBack) {
        callBack(xhr.status);
      }
    }
  },

  _parseErrors(errorResponse, errors, ignoredFields) {
    if (errorResponse.generalErrors && errorResponse.generalErrors.length > 0) {
      errors.push(errorResponse.generalErrors[0].message);
    } else {
      // Using email for registration, ignore username errors
      for (let property in errorResponse.fieldErrors) {
        // Ignore errors if requested
        if (ignoredFields.indexOf(property) !== -1) {
          continue;
        }

        if (errorResponse.fieldErrors.hasOwnProperty(property)) {
          for (let i = 0; i < errorResponse.fieldErrors[property].length; i++) {

            errors.push(errorResponse.fieldErrors[property][i].code);
          }
        }
      }
    }
  },

  _writeLocalStorage(user) {
    let data = {};
    data.email = user.email;
    data.id = user.id;
    if (user.firstName && user.lastName) {
      data.name = user.firstName + ' ' + user.lastName;
    } else if (user.firstName) {
      data.name = user.firstName;
    } else if (user.username) {
      data.name = user.username;
    } else {
      data.name = user.email;
    }

    localStorage.user = JSON.stringify(data);
  }
};

export default auth;
