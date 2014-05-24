/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;

describe('Polymer generator test', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
      if (err) {
        return done(err);
      }

      this.polymer = helpers.createGenerator('polymer:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      this.polymer.options['skip-install'] = true;

      done();
    }.bind(this));
  });

  it('the generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.app = require('../app');
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
      'x-foo.html'
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
