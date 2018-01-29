# Passport Node & React Example

This project contains an example project that illustrates using Passport with Node and React.

## Prerequisites
You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)

## Installation
* `git clone https://github.com/inversoft/passport-example-template`
* `cd passport-example-template`
* `./server> npm install`
* `./react> npm install`

## Passport and Database Configuration
* Start up Passport Backend
* Log into Passport Backend and create a new API key using the value from the `server/config/config.json` configuration file
* In the Passport Backend, you need to configure JWT.
    * Go to Settings > Applications, locate the application named 'Example Application' and click the Edit button in the Action column. 
    * Go to the JWT tab, and enable JWT. 
    * Choose 'RSA using SHA-256' (any of the RSA options will work) and click the blue button with the arrow icon to generate your RSA keys.
    * Click the save button at the top of the page.

## Running / Development
* `./server> npm start`
  * Debug mode `./server> node --inspect server.js`
* `./react> npm start`
  * This should open a browser to [https://localhost:3000](https://localhost:3000). 
