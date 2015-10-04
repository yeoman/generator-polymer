/*global describe, beforeEach, before, it*/

var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('yeoman-generator').assert;

describe('yo polymer:seed', function() {

  describe('yo polymer:seed with WCT test', function () {

    before(function (done) {
      helpers.run(path.join(__dirname, '../seed'))
        .inDir(path.join(__dirname, './tmp'))
        .withArguments(['seed-el'])
        .withPrompts({
          ghUser: 'test-user',
          elementName: 'seed-el',
          includeWCT: true
        })
        .on('end', done);
    });

    it('creates expected files', function () {
      var expected = [
        'bower.json',
        '.gitignore',
        'index.html',
        'README.md',
        'seed-el.html',
        'demo/index.html',
        'test/index.html',
        'test/basic-test.html'
      ];

      assert.file(expected);
    });

    it('creates the correct bower.json content', function () {
      assert.fileContent('bower.json', /"name": "seed-el"/);
      assert.fileContent('bower.json', /"main": "seed-el.html"/);
    });

    it('includes WCT', function() {
      assert.fileContent('bower.json', /web-component-tester/gm);
    });

  });

  describe('yo polymer:seed without WCT test', function () {

    before(function (done) {
      helpers.run(path.join(__dirname, '../seed'))
        .inDir(path.join(__dirname, './tmp'))
        .withArguments(['seed-el'])
        .withPrompts({
          ghUser: 'test-user',
          elementName: 'seed-el',
          includeWCT: false
        })
        .on('end', done);
    });

    it('does not include WCT', function() {
      assert.noFileContent('bower.json', /web-component-tester/gm);
    });

  });

});
