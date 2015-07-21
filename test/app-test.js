/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('yeoman-generator').assert;

describe('yo polymer:app with WCT test', function () {

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

  it('includes WCT', function() {
    assert.fileContent('bower.json', /web-component-tester/gm);
    assert.fileContent('bower.json', /test-fixture/gm);
    assert.fileContent('package.json', /web-component-tester/gm);
    assert.fileContent('gulpfile.js', /^require\('web-component-tester'\).+/gm);
  });

});

describe('yo polymer:app without WCT test', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['--skip-install'])
      .withPrompt({
        includeWCT: false
      })
      .on('end', done);
  });

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
      'README.md'
    ];

    assert.file(expected);
  });

  it('does not include WCT', function() {
    assert.noFileContent('bower.json', /web-component-tester/gm);
    assert.noFileContent('bower.json', /test-fixture/gm);
    assert.noFileContent('package.json', /web-component-tester/gm);
    assert.fileContent(
      'gulpfile.js', /^\/\/\srequire\('web-component-tester'\).+/gm
    );
  });

});
