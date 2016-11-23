/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
const errors = {
  'bad-constructor-args': 'Bad argument given to the constructor. Only ' +
    'JavaScript objects with directories can be passed to the constructor.',
  'bad-project-path': 'Either not project path was supplied or it could not ' +
    'read by sw-testing-helpers.',
};

/**
 * A simple class to make errors and to help with testing.
 */
class ErrorFactory {
  /**
   * @param {string} name The error name to be generated.
   * @param {Error} [thrownError] The thrown error that resulted in this
   * message.
   * @return {Error} The generated error.
   */
  static createError(name, thrownError) {
    if (!(name in errors)) {
      throw new Error(`Unable to generate error '${name}'.`);
    }

    let message = errors[name];
    let stack = null;
    if (thrownError) {
      message += ` [${thrownError.message}]`;
      stack = thrownError.stack;
    }

    const generatedError = new Error();
    generatedError.name = name;
    generatedError.message = message;
    generatedError.stack = stack;
    return generatedError;
  }

  /**
   * Returns the object containing all error names and messages.
   * @return {Object} Error names and messages.
   */
  static getAllErrors() {
    return errors;
  }
}

module.exports = ErrorFactory;
