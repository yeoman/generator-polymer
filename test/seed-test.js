/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;

describe('yo polymer:seed test', function () {
  before(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.polymer = helpers.createGenerator('polymer:seed', [
        '../../seed', [
          helpers.createDummyGenerator(),
          'mocha:seed'
        ]
      ]);
      this.polymer.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.seed = require('../seed');
  });

  it('creates expected files', function (done) {
    var expected = [
      ['bower.json', /"name": "x-foo"/, /"main": "x-foo.html"/],
      '.bowerrc',
      '.editorconfig',
      '.gitignore',
      '.jshintrc',
      'demo.html',
      'index.html',
      'README.md',
      'x-foo.css',
      'x-foo.html',
      'test/runner.html',
      'test/tests.html',
      'test/x-foo-basic.html',
    ];

    helpers.mockPrompt(this.polymer, {
      ghUser: 'test-user',
      elementName: 'x-foo'
    });

    this.polymer.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

});
