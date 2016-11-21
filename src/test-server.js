/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

'use strict';

/* eslint-env node */

const express = require('express');
const exphbs  = require('express-handlebars');
const path = require('path');
const glob = require('glob');

/**
 * <p>A super simple class that will start and stop an
 * express server with a few nice defaults and just removes boilerplate
 * to server up static files.</p>
 *
 * <p><strong>NOTE: </strong>This should never be used as a production
 * web server.</p>
 *
 * @example
 * const TestServer = require('sw-testing-helpers').TestServer;
 *
 * let testServer = new TestServer();
 * testServer.startServer(path.join(__dirname, '..'), 8888)
 * .then(portNumber => {
 *   console.log('http://localhost:' + portNumber);
 * });
 *
 * // To kill at a later stage...
 * testServer.killServer();
 */
class TestServer {
  /**
   * Create a new TestServer instace
   */
  constructor() {
    this._server = null;
    this._app = express();
  }

  /**
   * If you need to extend the routes on the test server, you can access
   * the express app with this method.
   * @return {ExpressApp} The express app used to respond to requests.
   */
  getExpressApp() {
    return this._app;
  }

  /**
   * This will start the express server with the provided port and host.
   *
   * @param  {String} path                  Path to start the server on (i.e. './')
   * @param  {Number} [portNumber=0] portNumber        Optional parameter, by default will pick
   * a random available port.
   * @param  {String} [host='localhost'] host    Optional parameter, a host to bind
   * the express server to, by default this is localhost.
   * @return {Promise<Number>}                      Promise that resolves when the
   * server is started resolving with the port used.
   */
  startServer(assetPath, portNumber, host) {
    if (this._server) {
      this._server.close();
    }

    // 0 will pick a random port number
    if (typeof portNumber === 'undefined') {
      portNumber = 0;
    }

    if (typeof host === 'undefined') {
      host = 'localhost';
    }

    this._app.engine('handlebars', exphbs({
      defaultLayout: 'main',
      layoutsDir: path.join(__dirname, 'test-runner-assets', 'handlebars', 'layouts')
    }));
    this._app.set('views', path.join(__dirname, 'test-runner-assets', 'handlebars', 'views'));
    this._app.set('view engine', 'handlebars');

    this._projectRoot = assetPath;

    this._app.use('/', express.static(assetPath, {
      setHeaders: function(res) {
        res.setHeader('Service-Worker-Allowed', '/');
      }
    }));

    this._addBrowserTestHandler();
    this._addHomePage();

    return new Promise(resolve => {
      // Start service on desired port
      this._server = this._app.listen(portNumber, host, () => {
        const address = this._server.address();
        resolve(`http://${address.address}:${address.port}`);
      });
    });
  }

  _addHomePage() {
    this._app.get('/', (req, res) => {
      const testGlob = path.join(this._projectRoot, 'test', '**', 'browser', '*.js');
      return new Promise((resolve, reject) => {
        glob(testGlob, {}, (err, files) => {
          if (err) {
            return reject(err);
          }

          resolve(files);
        })
      })
      .then((browserTests) => {
        res.render('home-page', {
          testCounts: {
            browser: browserTests.length
          },
          testFiles: {
            browser: browserTests
          }
        });
      })
      .catch((err) => {
        res.render('home-page', {
          err: err
        });
      });
    });
  }

  _addBrowserTestHandler() {
    this._app.get('/__sw-testing-helpers/browser-test/*', (req, res) => {
      console.log('Load Tests: ', path.join(this._projectRoot, req.params[0]));
      res.render('browser-test');
    });
  }

  /**
   * This method can be used to stop the express server
   */
  killServer() {
    if (this._server) {
      this._server.close();
      this._server = null;
    }
  }
}

module.exports = TestServer;
