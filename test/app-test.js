/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('yeoman-generator').assert;

describe('yo polymer:app test', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['--skip-install'])
      .withPrompt({
        includeCore: true,
        includePaper: true,
        includeSass: true,
        includeLibSass: true,
        includeWCT: true
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    var expected = [
      'bower.json',
      'package.json',
      'wct.conf.js',
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
      'app/test/index.html',
      'app/test/yo-greeting-basic.html',
      'app/test/yo-list-basic.html'
    ];

    assert.file(expected);
  });

});
