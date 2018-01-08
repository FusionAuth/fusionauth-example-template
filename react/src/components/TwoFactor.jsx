/*
 * Copyright (c) 2017, Inversoft Inc., All Rights Reserved
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 */
import React, { Component } from 'react';
import { browserHistory, Link } from 'react-router';

import Errors from './Errors';
import auth from '../auth';

class TwoFactor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: []
    };

    this._handleChange = this._handleChange.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  _handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  _handleFormSubmit(event) {
    event.preventDefault();
    auth.completeTwoFactorLogin(this.state.code, localStorage.twoFactorId, (status, response) => {
      if (status === 200 || status === 212) {
        delete localStorage.twoFactorId;
        localStorage.access_token = response.token;
        browserHistory.push('/');
      } else if (status === 202) {
        delete localStorage.twoFactorId;
        this.setState({
          'errors': ['[AuthenticatedNotRegistered]']
        })
      } else if (status === 404) {
        // twoFactorId has expired, need to go back to login and try again
        delete localStorage.twoFactorId;
        browserHistory.push('/');
      } else if (status === 409) {
        this.setState({
          'errors': ['[AccountLocked]']
        })
      } else if (status === 410) {
        // Expired User same as bad credentials
      } else if (status === 421) {
        // Bad Two Factor code, retry
        this.setState({
          'errors': ['[InvalidTwoFactorCode]']
        })
      } else {
        this.setState({
          'errors': response
        })
      }
    });
  }

  render() {
    return (
       <div className="login" >
        <Errors errors={this.state.errors} />
        <form id="two-factor" onSubmit={this._handleFormSubmit}>
          <label>
            <input id="code" name="code" type="text" autoFocus placeholder="Verification code" spellCheck="false" autoCorrect="off" autoComplete="off" onChange={this._handleChange}/>
          </label>
          <input type="submit" value="Complete Login" className="submit button"/>
          Need another code? <Link to="/register">Send another code.</Link>
        </form>
      </div>
    );
  }
}

export default TwoFactor;
