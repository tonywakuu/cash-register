Cash Register
=====================

## Start

 * App deployed on [Netlify](https://liberabank.netlify.app/)
 * To install the app locally , clone this repository and run `npm install` from its directory
 * To run the server locally, run `npm start` and point your browser at `http://localhost:3000/`
 * To run the tests, install the app and run `npm test`

## Tools

 * [Node.js](https://nodejs.org/en/) is our server-side framework
 * [Express.js](http://expressjs.com/) is our Node web-server
 * [Chai](http://chaijs.com/) and [Mocha](https://mochajs.org/) handle unit-tests

 ## Assumptions

 * We're using a modern browser. No polyfills or legacy support.
 * We're using a desktop browser. No responsive design or other mobile support.
 * No malicious or mischievous actors. Input validation and sanitization is minimal.
 * We're connected to the web. Client-side libraries are loaded from a CDN.
 * No DB connectivity. All data managed by Node.js state.
 * Smaller transactions. Up to $1000, no $50 or $100 bills.
 * Serves as the boilerpater for scaled representation.

