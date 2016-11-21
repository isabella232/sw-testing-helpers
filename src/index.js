'use strict';

const stackTrace = require('stack-trace');
const path = require('path');
const fs = require('fs');

const TestServer = require('./test-server');

class SWTestingHelpers {
  constructor() {
    this._directories = {
      'browser-unit-tests': 'browser'
    };
  }

  // TODO: Should be able to register some or all tests
  registerTests() {
    // Get expected directories.
    const browserDirectory = this._directories['browser-unit-tests'];
    const callingFilename = stackTrace.get()[1].getFileName();


    const browserTestFiles = this.getTestFiles(
      path.dirname(callingFilename),
      this._directories['browser-unit-tests']
    );

    // Require in the browser files and run them
    this. addBrowserTests(browserTestFiles);
  }

  getTestFiles(testsRootPath, testSubDirectory) {
    const desiredTestDir = path.join(
      testsRootPath,
      testSubDirectory
    );

    let browserTestFiles = [];
    try {
      fs.accessSync(desiredTestDir, fs.R_OK);
      browserTestFiles = fs.readdirSync(desiredTestDir).map((filename) => {
        return path.join(desiredTestDir, filename);
      });
    } catch (err) {
      // NOOP - No browser tests found.
    }
    return browserTestFiles;
  }

  addBrowserTests(testFiles) {
    describe('[sw-testing-helpers] Browser Unit Tests', function() {
      before(function() {
        return this.startTestServer();
      });

      testFiles.forEach((testFile) => {
        require(testFile);
      })
    });
  }

  startTestServer(desiredPath, port) {
    this._testServer = new TestServer();
    return this._testServer.startServer(desiredPath, port);
  }
}

module.exports = SWTestingHelpers;
