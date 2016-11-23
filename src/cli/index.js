/**
 * Copyright 2016 Google Inc.
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
**/
'use strict';

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const chalk = require('chalk');

const SWTestingHelpers = require('../index');
const packageInfo = require('../../package.json');
const CLILog = require('./cli-log');

/**
 * The module that performs the logic of the CLI.
 */
class SWTestingHelpersCLI {
  /**
   * Initialises the class.
   */
  constructor() {
    this._spawnedProcesses = [];
  }

  /**
   * This method is the entry method that kicks of logic and expects the
   * output of minimist module.
   * @param {object} argv This is the output minimist which parses the command
   * line arguments.
   * @return {Promise} Returns a promise for the given task.
   */
  argv(argv) {
    const cliArgs = minimist(argv);
    if (cliArgs._.length > 0) {
      // We have a command
      return this.handleCommand(cliArgs._[0], cliArgs._.splice(1), cliArgs)
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(1);
      });
    } else {
      // we have a flag only request
      return this.handleFlag(cliArgs)
      .then(() => {
        process.exit(0);
      })
      .catch(() => {
        process.exit(1);
      });
    }
  }

  /**
   * Prints the help text to the terminal.
   */
  printHelpText() {
    const helpText = fs.readFileSync(
      path.join(__dirname, 'cli-help.txt'), 'utf8');
    CLILog.info(helpText);
  }

  /**
   * If there is no command given to the CLI then the flags will be passed
   * to this function in case a relevant action can be taken.
   * @param {object} args The available flags from the command line.
   * @return {Promise} returns a promise once handled.
   */
  handleFlag(args) {
    let handled = false;
    if (args.h || args.help) {
      this.printHelpText();
      handled = true;
    }

    if (args.v || args.version) {
      CLILog.info(packageInfo.version);
      handled = true;
    }

    if (handled) {
      return Promise.resolve();
    }

    // This is a fallback
    this.printHelpText();
    return Promise.reject();
  }

  /**
   * If a command is given in the command line args, this method will handle
   * the appropriate action.
   * @param {string} command The command name.
   * @param {object} args The arguments given to this command.
   * @param {object} flags The flags supplied with the command line.
   * @return {Promise} A promise for the provided task.
   */
  handleCommand(command, args, flags) {
    switch (command) {
      case 'serve':
        return this.startTestBrowser();
      default:
        CLILog.error(`Invlaid command given '${command}'`);
        return Promise.reject();
    }
  }

  /**
   * Starts the test server in the current working directory.
   * @return {Promise} Returns a promise that resolves once the server has
   * been started.
   */
  startTestBrowser() {
    const testingHelpers = new SWTestingHelpers();
    return testingHelpers.startTestServer(process.cwd(), 8080)
    .then((serverUrl) => {
      CLILog.info('-----------------------------');
      CLILog.info('');
      CLILog.info(`    Test Server @ ${chalk.magenta(serverUrl)}`);
      CLILog.info('');
      CLILog.info('-----------------------------');
    })
    .then(() => {
      return new Promise((resolve) => {
        // NOOP
      });
    })
    .catch((err) => {
      throw err;
    });
  }
}

module.exports = SWTestingHelpersCLI;
