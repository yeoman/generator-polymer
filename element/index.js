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
    }]
  },
  {
    type: 'input',
    name: 'otherElementSelection',
    message: 'Import other elements into this one? (e.g "a.html b.html" or leave blank)',
    default: ""
  }];


  this.prompt(prompts, function (props) {

    var features = props.features;
    function hasFeature(feat) { return features.indexOf(feat) !== -1; }

    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.includeConstructor = hasFeature('includeConstructor');
    this.includeImport = hasFeature('includeImport');
    this.otherElementSelection = props.otherElementSelection;

    cb();
  }.bind(this));
};


Generator.prototype.createElementFiles = function createElementFiles() {
  var destFile = path.join('app/elements',this.name + '.html');
  this.template('polymer-element' + '.html', destFile);

  if(this.includeImport){
     this.addImportToFile({
      fileName:  'index.html',
      importUrl: 'elements/' + this.name + '.html',
      tagName: this.name + '-element'
    });   
  }
};

Generator.prototype.addImports = function addImports(){
  var elName = this.name;
  // TODO: simplify the logic here. Too much I/O
  if(this.otherElementSelection){
    var imports = this.otherElementSelection.split(' '); 
    imports.forEach(function(importItem){
      importItem = importItem.replace('.html','');
      this.addImportToFile({
        fileName:   'elements/' + elName + '.html',
        importUrl:  importItem + '.html',
        tagName:    importItem, //-element
        needleHead: '<polymer-element',
        needleBody:  '</template>'
      });

    }.bind(this));
  }
}
