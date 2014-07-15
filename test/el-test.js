/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;

describe('yo polymer:el test', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      // Create the polymer:app generator
      this.polymer = helpers.createGenerator('polymer:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      this.polymer.options['skip-install'] = true;

      // Create the polymer:el generator
      this.element = helpers.createGenerator('polymer:el', [
        '../../el', [
          helpers.createDummyGenerator(),
          'mocha:el'
        ]
      ], 'x-foo');

      done();
    }.bind(this));
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.el = require('../el');
  });

  it('creates expected files', function (done) {
    var expected = [
      'app/elements/x-foo.html'
    ];

    helpers.mockPrompt(this.polymer, {
      includeCore: true,
      includePaper: true
    });

    // Run the polymer:app generator
    this.polymer.run({}, function () {
      // Then run the polymer:el generator
      this.element.run({}, function() {
        helpers.assertFiles(expected);
        done();
      });
    }.bind(this));
  });

});
