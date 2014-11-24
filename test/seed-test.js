/*global describe, beforeEach, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('yeoman-generator').assert;

describe('yo polymer:seed test', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../seed'))
      .inDir(path.join(__dirname, './tmp'))
      .withArguments(['x-foo'])
      .withPrompt({
        ghUser: 'test-user',
        elementName: 'x-foo'
      })
      .on('end', done);
  });

  it('creates expected files', function () {
    var expected = [
      'bower.json',
      '.bowerrc',
      '.editorconfig',
      '.gitignore',
      '.jshintrc',
      'demo.html',
      'index.html',
      'README.md',
      'x-foo.css',
      'x-foo.html',
      'test/index.html',
      'test/x-foo-basic.html'
    ];

    assert.file(expected);
  });

  it('creates the correct bower.json content', function () {
    assert.fileContent('bower.json', /"name": "x-foo"/);
    assert.fileContent('bower.json', /"main": "x-foo.html"/);
  });

});
