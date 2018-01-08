import React, { Component } from 'react';
import passport_logo from './assets/img/passport_logo.svg';
import auth from './auth';
import Greeting from './components/Greeting';

import './assets/App.css';
import './assets/Form.css';
import './assets/index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: auth.loggedIn()
    };

    this.setAuthenticated = this.setAuthenticated.bind(this);
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={passport_logo} className="App-logo" alt="logo" />
          <h2>Example</h2>
        </div>
        <div className="App-content">
          <Greeting />
          {this.props.children}
        </div>
      </div>
    );
  }

  setAuthenticated(authenticated) {
    if (!authenticated) {
      localStorage.removeItem('access_token');
    }

    this.setState({
      authenticated: authenticated
    });
  }

}

export default App;
