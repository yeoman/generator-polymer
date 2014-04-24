var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var _s = require('underscore.string');

module.exports = Generator;

function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  this.options = options;
}

util.inherits(Generator, yeoman.generators.Base);

// Generator.prototype.askFor = function askFor() {
//   var cb = this.async();
//   //console.log(this.yeoman);
//   console.log('Out of the box I include the Polymer untitled-element.');

//   this.prompt(prompts, function (props) {
//     // manually deal with the response, get back and store the results.
//     // we change a bit this way of doing to automatically do this in the self.prompt() method.

//     cb();
//   }.bind(this));
// };

Generator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

Generator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

Generator.prototype.jshint = function jshint() {
  this.copy('jshintrc', '.jshintrc');
};

Generator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', '.editorconfig');
};

Generator.prototype.mainStylesheet = function mainStylesheet() {
  this.template('_untitled-element.css', _s.slugify(this.appname) + '.css');
};

Generator.prototype.mainImport = function mainImport() {
  this.template('_untitled-element.html', _s.slugify(this.appname) + '.html');
};

Generator.prototype.writeIndex = function writeIndex() {
  this.template('_index.html', 'index.html');
};

Generator.prototype.demo = function demo() {
  this.template('_demo.html', 'demo.html');
};

Generator.prototype.readme = function readme() {
  this.template('_README.md', 'README.md');
};

Generator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    npm: false,
    callback: done
  });
}
