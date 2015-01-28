/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('yeoman-generator').assert;

describe('yo polymer:el test', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['--skip-install'])
      .withPrompts({
        includeCore: false,
        includePaper: false,
        includeSass: false,
        includeLibSass: false
      })
      .on('end', done);
  });

  //el supplied with name only
  before(function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['x-foo'])
      .withPrompts({
        externalStyle: true,
        includeImport: false
      })
      .on('end', done);
  });

  //el supplied with path baz/x-foo
  before(function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['baz/x-foo'])
      .withPrompts({
        externalStyle: true,
        includeImport: false
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    var expected = [
      'app/elements/x-foo/x-foo.html',
      'app/elements/x-foo/x-foo.css'
    ];

    assert.file(expected);
  });

  it('accepts paths and creates expected files', function () {
    var expected = [
      'app/elements/baz/foo-element/foo-element.html',
      'app/elements/baz/foo-element/foo-element.css'
    ];

    assert.file(expected);
  });

  it('imports optional dependencies', function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['fancy-menu', 'core-menu', 'core-icon-button'])
      .withPrompts({
        externalStyle: true,
        includeImport: false
      })
      .on('end', function() {
        assert.fileContent(
          'app/elements/fancy-menu/fancy-menu.html', /<link rel="import" href="..\/..\/bower_components\/core-menu\/core-menu.html">/
        );
        assert.fileContent(
          'app/elements/fancy-menu/fancy-menu.html', /<link rel="import" href="..\/..\/bower_components\/core-icon-button\/core-icon-button.html">/
        );
        done();
      });
  });

});
