var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var path = require('path');

module.exports = Generator;

function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
  this.options = options;
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.askFor = function askFor() {
  var cb = this.async();
  //console.log(this.yeoman);
  console.log('Out of the box I include the Polymer untitled-element.');

  var prompts = [{
    name: 'elementName',
    message: 'What is your element name',
    default: 'untitled-element'
  }];

  this.prompt(prompts, function (props) {
    // manually deal with the response, get back and store the results.
    // we change a bit this way of doing to automatically do this in the self.prompt() method.
    this.elementName = props.elementName

    cb();
  }.bind(this));
};

Generator.prototype.git = function git() {
  this.copy('gitignore', this.elementName + '/.gitignore');
  this.copy('gitattributes', this.elementName + '/.gitattributes');
};

Generator.prototype.bower = function bower() {
  this.copy('bowerrc', this.elementName + '/.bowerrc');
  this.copy('_bower.json', this.elementName + '/bower.json');
};

Generator.prototype.jshint = function jshint() {
  this.copy('jshintrc', this.elementName + '/.jshintrc');
};

Generator.prototype.editorConfig = function editorConfig() {
  this.copy('editorconfig', this.elementName + '/.editorconfig');
};

Generator.prototype.mainStylesheet = function mainStylesheet() {
  this.template('_untitled-element.css', this.elementName + '/' + this.elementName + '.css');
};

Generator.prototype.mainImport = function mainImport() {
  this.template('_untitled-element.html', this.elementName + '/' + this.elementName + '.html');
};

Generator.prototype.writeIndex = function writeIndex() {
  this.template('_index.html', this.elementName + '/index.html');
};

Generator.prototype.demo = function demo() {
  this.template('_demo.html', this.elementName + '/demo.html');
};

Generator.prototype.readme = function readme() {
  this.template('_README.md', this.elementName + '/README.md');
};

Generator.prototype.install = function () {
  if (this.options['skip-install']) {
    return;
  }

  var origin = process.cwd();
  process.chdir(path.join(origin, this.elementName));

  var done = this.async();
  var installComplete = function() {
    process.chdir(origin);
    done();
  };

  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    npm: false,
    callback: installComplete
  });

}
