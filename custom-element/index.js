/*jshint latedef:false */
var path = require('path'),
  util = require('util'),
  yeoman = require('yeoman-generator'),
  scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);
  var dirPath = '../templates';
  this.sourceRoot(path.join(__dirname, dirPath));
}

util.inherits(Generator, scriptBase);

Generator.prototype.createElementFiles = function createElementFiles() {

  var destFile = path.join('app/elements', this.name + '.html');
  this.template('custom-element' + '.html', destFile);
  this.addImportToIndex('elements/' + this.name + '.html', this.name + '-element');
};

