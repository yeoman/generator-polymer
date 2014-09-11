/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;

describe('yo polymer:app test', function () {
  before(function (done) {
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
      'bower.json',
      'package.json',
      '.bowerrc',
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      'Gruntfile.js',
      '.jshintrc',
      'app/index.html',
      'app/styles/main.scss',
      'app/scripts/app.js',
      'app/404.html',
      'app/favicon.ico',
      'app/.htaccess',
      'app/robots.txt',
      'app/elements/elements.html',
      'app/elements/yo-greeting/yo-greeting.html',
      'app/elements/yo-greeting/yo-greeting.scss',
      'app/elements/yo-list/yo-list.html',
      'app/elements/yo-list/yo-list.scss',
      'app/test/runner.html',
      'app/test/tests.html',
      'app/test/yo-greeting-basic.html',
      'app/test/yo-list-basic.html'
    ];

    helpers.mockPrompt(this.polymer, {
      includeCore: true,
      includePaper: true,
      includeSass: true,
      includeLibSass: true
    });

    this.polymer.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });
  });

});
