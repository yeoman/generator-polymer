/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('yeoman-generator').assert;

describe('yo polymer:blank test-project', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../blank'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['test-project', '--skip-install'])
      .on('end', done);
  });

  it('creates expected files', function () {
    var expected = [
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.jscsrc',
      '.jshintrc',
      'app/robots.txt',
      'app/index.html',
      'app/elements/elements.html',
      'bower.json',
      'gulpfile.js',
      'LICENSE.md',
      'package.json',
      'README.md'
    ];

    assert.file(expected);
  });

});
