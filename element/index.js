/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');
/**
  @todo: setup tests for generator
  @todo: set up tests for resulting element
*/
module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);
  var dirPath = '../templates';
  this.sourceRoot(path.join(__dirname, dirPath));

  // XXX default and banner to be implemented
  this.argument('attributes', {
    type: Array,
    defaults: [],
    banner: 'field[:defult] field[:default]'
  });


  // parse back the attributes provided, build an array of attr
  this.attrs = this.attributes.map(function (attr) {
    var parts = attr.split(':');
    return {
      name: parts[0],
      default: parts[1] || false
    };
  });

}

util.inherits(Generator, scriptBase);


Generator.prototype.askFor = function askFor() {

  var cb = this.async();

  var prompts = [
    {
      type: 'input',
      name: 'name',
      message: 'What prefixed name would you like to call your new element?',
      default: this.name || "carousel"
    },
    {
      type: 'confirm',
      name: 'includeConstructor',
      message: 'Would you like to include constructor=””?',
      default: false
    },{
      type: 'input',
      name: 'otherElementSelection',
      message: 'Which other elements would you like to include? (space separate with paths)',
      default: ""
    },{
      type: 'input',
      name: 'applyAuthorStyles',
      message: 'Would you like to apply author styles to the ShadowDom?',
      default: true
  }];

  this.prompt(prompts, function (props) {
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeConstructor = props.includeConstructor;
    this.name = props.name;
    this.otherElementSelection = props.otherElementSelection;
    this.applyAuthorStyles = props.applyAuthorStyles;

    cb();
  }.bind(this));
};


Generator.prototype.createElementFiles = function createElementFiles() {
  var destFile = path.join('elements', this.name + '.html');
  this.template('polymer-element' + '.html', destFile);
  this.template('polymer-element/index.html', 'index.html');
  this.template('polymer-element/bower.json', 'bower.json');
  // this.addImportToIndex('elements/' + this.name + '.html', this.name + '-element');
};


