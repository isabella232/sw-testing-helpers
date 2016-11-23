'use strict';

const stackTrace = require('stack-trace');
const path = require('path');
const fs = require('fs');

const TestServer = require('./test-server');
const ErrorFactory = require('./error-factory.js');

/* eslint-env mocha */

/**
 * Core of SWTestingHelpers logic.
 */
class SWTestingHelpers {
  /**
   * Constructor takes no parameters.
   * @param {String} projectDirectory The directory of the project
   * @param {Object} directories
   * @param {String} directories.browser-unit-tests The directory name for
   * browser tests
   */
  constructor(projectDirectory, directories) {
    try {
      fs.accessSync(projectDirectory, fs.R_OK);
    } catch (err) {
      throw ErrorFactory.createError('bad-project-path');
    }

    if (typeof directories !== 'undefined' &&
      (typeof directories !== 'object' || Array.isArray(directories))) {
      throw ErrorFactory.createError('bad-constructor-args');
    }

    this._projectDirectory = projectDirectory;
    this._directories = {
      'browser-unit-tests': path.join('test', 'browser'),
    };

    if (directories) {
      const knownDirectoryKeys = Object.keys(this._directories);
      knownDirectoryKeys.forEach((directoryKey) => {
        if (!directories[directoryKey]) {
          return;
        }

        this._directories[directoryKey] = directories[directoryKey];
      });
    }
  }

  /**
   * This registers all tests (browser, service worker and selnium)
   */
  registerAllTests() {
    /** const callingFilename = stackTrace.get()[1].getFileName();
    let testsDirectory = path.dirname(callingFilename);
    let projectDirectory = path.join(testsDirectory, '..');**/

    this.registerBrowserTests();
  }

  /**
   * This method registers the browser tests for the current project with
   * Mocha.
   * @return {number} Returns number of files found and added
   */
  registerBrowserTests() {
    const browserTestFiles = this._getTestFiles(
      path.join(this._projectDirectory,
        this._directories['browser-unit-tests']
      )
    );

    // Require in the browser files and run them
    this._addBrowserTests(browserTestFiles);

    return browserTestFiles.length;
  }

  /**
   * This method returns the available test files from a particular
   * subdirectory.
   * @param {String} testsDir The directory to find '.js' test files in.
   * @return {Array<String>} Returns an array of absolute paths for tests.
   */
  _getTestFiles(testsDir) {
    let browserTestFiles = [];
    try {
      fs.accessSync(testsDir, fs.R_OK);
      browserTestFiles = fs.readdirSync(testsDir).map((filename) => {
        return path.join(testsDir, filename);
      });
    } catch (err) {
      // NOOP - No browser tests found.
    }
    return browserTestFiles;
  }

  /**
   * This method adds the test files to mocha so they are tested.
   * @param {Array<String>} testFiles An array of paths to test files.
   * @param {String} projectDirectory The project directory this is run
   * against.
   */
  _addBrowserTests(testFiles) {
    describe('[sw-testing-helpers] Browser Unit Tests', function() {
      before(function() {
        return this.startTestServer(this._projectDirectory);
      }.bind(this));

      testFiles.forEach((testFile) => {
        require(testFile);
      });
    }.bind(this));
  }

  /**
   * This methods starts the local test server that makes the tests available.
   * @param {string} desiredPath The path to start the server in (i.e. path
   * to server files from).
   * @param {number} port The port to start the server on. It's random
   * otherwise.
   * @return {Promise<String>} Returns a promise that resolves with the server
   * URL.
   */
  startTestServer(desiredPath, port) {
    this._testServer = new TestServer();
    return this._testServer.startServer(desiredPath, port);
  }
}

module.exports = SWTestingHelpers;
