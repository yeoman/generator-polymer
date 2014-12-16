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
        includeCore: false,
        includePaper: false,
        includeSass: false,
        includeLibSass: false
      })
      .on('end', done);
  });

  before(function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['x-foo'])
      .withPrompt({
        externalStyle: true,
        includeImport: false
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    var expected = [
      'app/elements/x-foo/x-foo.html',
      'app/elements/x-foo/x-foo.css',
      'app/elements/x-foo/index.html',
      'app/elements/x-foo/demo.html'
    ];

    assert.file(expected);
  });

  it('imports optional dependencies', function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['fancy-menu', 'core-menu', 'core-icon-button'])
      .withPrompt({
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
  
  if('imports demo and documentation files on ', function (done) {
    helpers.run(path.join(__dirname, '../el'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['my-element'])
      .withOptions({ collaborative: true })
      .withPrompt({
        externalStyle: false,
        includeImport: false
      })
      .on('end', function() {
        var expected = [
          'app/elements/my-element/my-element.html',
          'app/elements/my-element/index.html',
          'app/elements/my-element/demo.html'
        ];

        assert.file(expected);
        
        done();
      });
  });

});
