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
      type: 'checkbox',
      name: 'features',
      message: 'What more would you like?',
      choices: [
      { 
        value: 'includeConstructor',
        name: 'Would you like to include constructor=””?',
        checked: false
      },{
        value: 'includeImport',
        name: 'Import to your index.html using HTML imports?',
        checked: false
      },{
        value: 'applyAuthorStyles',
        name: 'Would you like to apply author styles to the ShadowDom?',
        checked: false
      }]
    },{
      type: 'input',
      name: 'otherElementSelection',
      message: 'Which other elements would you like to include? (space separate with paths)',
      default: ""
  }];

  this.prompt(prompts, function (props) {
    var features = props.features;
    function hasFeature(feat) { return features.indexOf(feat) !== -1; }
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeConstructor = hasFeature('includeConstructor');
    this.includeImport = hasFeature('includeImport');
    this.applyAuthorStyles = hasFeature('applyAuthorStyles');
    this.name = props.name;
    this.others = props.otherElementSelection.split(' '); 
    

    cb();
  }.bind(this));
};


Generator.prototype.createElementFiles = function createElementFiles() {
  var destFile = path.join('elements', this.name + '.html');
  this.template('polymer-element' + '.html', destFile);
  this.template('polymer-element/index.html', 'index.html');
  this.template('polymer-element/bower.json', 'bower.json');
};


