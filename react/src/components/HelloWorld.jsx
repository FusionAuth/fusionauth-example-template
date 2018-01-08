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
import React, {Component} from 'react';
import { browserHistory } from 'react-router';

const configuration = require("../../config/config.js");

class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.load = this.load.bind(this);
    this._handleAJAXResponse = this._handleAJAXResponse.bind(this);
  }

  componentDidMount() {
    this.load();
  }

  load() {
    this.xhr = new XMLHttpRequest();
    this.xhr.onreadystatechange = this._handleAJAXResponse;

    configuration(function(config) {
      this.xhr.open('GET', config.backend.url + '/api/application', true);
      this.xhr.setRequestHeader('Authorization', 'JWT ' + localStorage.access_token);
      this.xhr.send();
    }.bind(this));
  }

  render() {
    return (
      <div>
        {this.state.message}
      </div>
    );
  }

  _handleAJAXResponse() {
    if (this.xhr.readyState === XMLHttpRequest.DONE) {
      if (this.xhr.status === 200) {
        const response = JSON.parse(this.xhr.responseText);
        this.setState(response);
      } else if (this.xhr.status === 401 || this.xhr.status === 403) {
        // JWT is likely expired, force the user to log in again.
        browserHistory.push('/logout');
      }
    }
  }
}

export default HelloWorld;
