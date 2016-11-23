const path = require('path');
const SWTestingHelpers = require('../../../src/index.js');

const testingHelper = new SWTestingHelpers(path.join(__dirname, '..'), {
  'browser-unit-tests': 'custom-browser',
});
testingHelper.registerAllTests();
