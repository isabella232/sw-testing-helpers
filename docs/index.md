---
layout: index
title: "My Project Title"
navigation_weight: 0
---

# Why

Testing service workers is a new space and this module is the result of some
exploration in this space.

There are two main pieces of functionality offered by this repo:

1. Run Mocha unit tests against Selenium WebDriver instances
(i.e. real browsers) and print results in a useful, human readable format.
1. Run Mocha unit tests in a service worker context.
1. Manage service worker life-cycle events and manage scoping of service
workers to avoid tests affecting each other.

# Install

Installation can be done via NPM:

    npm install --save-dev sw-testing-helpers

# Usage

## Running Mocha Tests in WebDriver

To run your Mocha tests in WebDriver browser, simply pass in the browser name,
the WebDriver instance and the URL for your Mocha tests.

``` javascript
const mochaUtils = require('sw-testing-helpers').mochaUtils;

mochaUtils.startWebDriverMochaTests(
  browserInfo.getPrettyName(),
  globalDriverReference,
  `${testServerURL}/test/browser-tests/`
)
.then(testResults => {
  if (testResults.failed.length > 0) {
    const errorMessage = mochaHelper.prettyPrintErrors(
      browserInfo.getPrettyName(),
      testResults
    );

    throw new Error(errorMessage);
  }
});
```

This will expect your Mocha tests in the web page to use the mochaUtils to
start the test (This is so the results are managed in the page and made
available when the tests are finished).

```html
<!-- sw-testing-helper -->
<script src="/node_modules/sw-testing-helper/browser/mocha-utils.js"></script>

<script>mocha.setup({
  ui: 'bdd'
})</script>

<!-- Add test scripts here -->

<script>
  (function() {
    // should adds objects to prototypes which requires this call to be made
    // before any tests are run.
    window.chai.should();

    window.goog.mochaUtils.startInBrowserMochaTests()
    .then(results => {
      window.testsuite = results;
    });
  })();
</script>
```

## Running Mocha Tests in Service Worker Context

If you want to run a set of unit tests in a service worker you can start them
and get the results as follows:

1. In your web page create your unit test as follows:

      ```javascript
      it('should perform sw tests', function() {
        return window.goog.mochaUtils.startServiceWorkerMochaTests(SERVICE_WORKER_PATH + '/test-sw.js')
        .then(testResults => {
          if (testResults.failed.length > 0) {
            const errorMessage = window.goog.mochaUtils
              .prettyPrintErrors(loadedSW, testResults);
            throw new Error(errorMessage);
          }
        });
      }
      ```

1. Inside your service worker you need to import, mocha, chai and
mocha-utils.js (Note: mocha.run() will be automatically called
by mocha-utils.js):

    ```javascript
    importScripts('/node_modules/mocha/mocha.js');
    importScripts('/node_modules/chai/chai.js');
    importScripts('/node_modules/sw-testing-helpers/browser/mocha-utils.js');

    self.chai.should();
    mocha.setup({
      ui: 'bdd',
      reporter: null
    });

    describe('Test Suite in Service Worker', function() {
      it('should ....', function() {

      });
    });
    ```

# Browser Support
