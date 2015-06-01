/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('yeoman-generator').assert;

describe('yo polymer:el test', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['--skip-install'])
      .withPrompt({
        includeWCT: true
      })
      .on('end', done);
  });

  before(function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['my-foo'])
      .withPrompt({
        includeImport: false
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    var expected = [
      'app/elements/my-foo/my-foo.html'
    ];

    assert.file(expected);
  });

  it('imports optional dependencies', function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['fancy-menu', 'iron-ajax', 'iron-a11y-keys'])
      .withPrompt({
        includeImport: false
      })
      .on('end', function() {
        assert.fileContent(
          'app/elements/fancy-menu/fancy-menu.html', /<link rel="import" href="..\/..\/bower_components\/iron-ajax\/iron-ajax.html">/
        );
        assert.fileContent(
          'app/elements/fancy-menu/fancy-menu.html', /<link rel="import" href="..\/..\/bower_components\/iron-a11y-keys\/iron-a11y-keys.html">/
        );
        done();
      });
  });

});

describe('yo polymer:el --docs test', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['--skip-install'])
      .withPrompt({
        includeWCT: true
      })
      .on('end', done);
  });

  before(function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['docs-el'])
      .withOptions({ 'docs': true })
      .withPrompt({
        includeImport: false
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    var expected = [
      'app/elements/docs-el/docs-el.html',
      'app/elements/docs-el/index.html',
      'app/elements/docs-el/demo/index.html'
    ];

    assert.file(expected);
  });
});

describe('yo polymer:el --path test', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['--skip-install'])
      .withPrompt({
        includeWCT: true
      })
      .on('end', done);
  });

  before(function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['path-el'])
      .withOptions({ 'path': 'foo/bar/baz' })
      .withPrompt({
        includeImport: false
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    var expected = [
      'app/elements/foo/bar/baz/path-el.html'
    ];

    assert.file(expected);
  });

  it('creates the right path to polymer', function () {
    assert.fileContent(
      'app/elements/foo/bar/baz/path-el.html',
      /<link rel="import" href="..\/..\/..\/..\/bower_components\/polymer\/polymer.html">/
    );
  });
});
