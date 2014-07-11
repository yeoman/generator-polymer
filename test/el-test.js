/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;

describe('Polymer generator test', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.polymer = helpers.createGenerator('polymer:el', [
        '../../el', [
          helpers.createDummyGenerator(),
          'mocha:el'
        ]
      ], 'x-foo');
      this.polymer.options['skip-install'] = true;

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

    this.polymer.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

});
