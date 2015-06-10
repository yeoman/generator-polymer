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
        includeWCT: true
      })
      .on('end', done);
  });

  // TODO: robdodson - test that we've created the right directories
  it('creates expected files', function () {
    var expected = [
      '.editorconfig',
      '.gitattributes',
      '.gitignore',
      '.jscsrc',
      '.jshintrc',
      'bower.json',
      'gulpfile.js',
      'LICENSE.md',
      'package.json',
      'README.md',
      'wct.conf.json'
    ];

    assert.file(expected);
  });

});
