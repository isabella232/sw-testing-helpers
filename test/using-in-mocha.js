const expect = require('chai').expect;
const path = require('path');

const SWTestingHelpers = require('../src/index.js');

require('chai').should();

describe('Test Use with Mocha', function() {
  it('should throw an error instantiated without args', function() {
    let thrownError = null;
    try {
      new SWTestingHelpers();
    } catch (err) {
      thrownError = err;
    }

    expect(thrownError).to.exist;
    thrownError.name.should.equal('bad-project-path');
  });

  const badInput = [
    false,
    true,
    [],
    '',
    'Hello, World',
    1234,
  ];
  badInput.forEach((badInput) => {
    it(`should throw error on bad constructor arg: '${badInput}'`, function() {
      let thrownError = null;
      try {
        new SWTestingHelpers(path.join(__dirname, '..'), badInput);
      } catch (err) {
        thrownError = err;
      }

      expect(thrownError).to.exist;
      thrownError.name.should.equal('bad-constructor-args');
    });
  });

  it('should allow valid options object', function() {
    new SWTestingHelpers(path.join(__dirname, '..'), {
      'browser-unit-tests': 'example-path',
    });
  });

  it('should run tests with custom paths', function() {
    const swTestingHelpers = new SWTestingHelpers(path.join(__dirname, 'examples', 'custom-paths'), {
      'browser-unit-tests': 'custom-browser',
    });

    const fileCount = swTestingHelpers.registerBrowserTests();
    fileCount.should.equal(1);
  });

  it('should run browser-only-tests', function() {
    require('./examples/browser-only-tests/test-file.js');
  });
});
