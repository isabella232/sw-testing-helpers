describe('Test Use with Mocha', function() {
  it('should be instantiable', function() {
    const SWTestingHelpers = require('../src/index.js');
    new SWTestingHelpers();
  });

  it('should be run browser-only-tests', function() {
    require('./examples/browser-only-tests/test-file.js');
  });
});
