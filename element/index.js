/*jshint latedef:false */
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var scriptBase = require('../script-base');

module.exports = Generator;

function Generator() {
  scriptBase.apply(this, arguments);
  var dirPath = '../templates';
  this.sourceRoot(path.join(__dirname, dirPath));

  // XXX default and banner to be implemented
  this.argument('attributes', {
    type: Array,
    defaults: [],
    banner: 'field[:type] field[:type]'
  });

  // parse back the attributes provided, build an array of attr
  this.attrs = this.attributes.map(function (attr) {
    var parts = attr.split(':');
    return {
      name: parts[0],
      type: parts[1] || 'string'
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
    default: "carousel"
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
  }];

  this.prompt(prompts, function (props) {
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeConstructor = props.includeConstructor;
    this.name = props.name;
    this.otherElementSelection = props.otherElementSelection;

    cb();
  }.bind(this));
};


Generator.prototype.createElementFiles = function createElementFiles() {
  var destFile = path.join('app/elements', this.name + '.html');
  this.template('polymer-element' + '.html', destFile);
};
