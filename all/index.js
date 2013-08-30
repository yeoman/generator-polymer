var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');

module.exports = Generator;

function Generator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  var dirPath = '../templates';
  this.sourceRoot(path.join(__dirname, dirPath));

  this.dirs = 'elements'.split(' ');

  args = ['application'];

  if (this.options['test-framework']) {
    this.env.options['test-framework'] = this.options['test-framework'];
  }

  // the api to hookFor and pass arguments may vary a bit.
  this.hookFor('polymer:app', {
    args: args
  });
  this.hookFor('polymer:element', {
    args: args
  });

  this.on('end', function () {
    this.installDependencies({ skipInstall: this.options['skip-install'] });
  });
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createDirLayout = function createDirLayout() {
  this.dirs.forEach(function (dir) {
    this.log.create('app/' + dir);
    this.mkdir(path.join('app/', dir));
  }.bind(this));
};
