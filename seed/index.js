'use strict';
var _ = require('lodash');
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');
var elementNameValidator = require('validate-element-name');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('element-name', {
      desc: 'Tag name of the element and directory to generate.',
      required: true
    });

    this.option('skip-install', {
      desc: 'Whether bower dependencies should be installed',
      defaults: false
    });

    this.option('skip-install-message', {
      desc: 'Whether commands run should be shown',
      defaults: false
    });

    this.sourceRoot(path.join(path.dirname(this.resolved), 'templates/seed-element'));
  },
  validate: function () {
    this.elementName = this['element-name'];
    var result = elementNameValidator(this.elementName);

    if (!result.isValid) {
      this.emit('error', new Error(chalk.red(result.message)));
    }

    if (result.message) {
      console.warn(chalk.yellow(result.message + '\n'));
    }

    return true;
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Out of the box I include Polymer\'s seed-element.'));

    var prompts = [{
        name: 'ghUser',
        message: 'What is your GitHub username?'
      }, {
        name: 'includeWCT',
        message: 'Would you like to include web-component-tester?',
        type: 'confirm'
      }
    ];

    this.prompt(prompts, function (props) {
      this.ghUser = props.ghUser;
      this.includeWCT = props.includeWCT;

      // Save user's GitHub name for when they want to use gh subgenerator
      this.config.set({
        ghUser: this.ghUser
      });
      this.config.save();

      done();
    }.bind(this));

  },
  seed: function () {

    // Process function to replace 'seed-element' in template files
    // with actual element name
    var renameElement = function (file) {
      file = file.toString();
      return file.replace(/seed-element/g, this.elementName);
    }.bind(this);

    this.fs.copy([
        this.templatePath() + '/**',
        this.templatePath() + '/**/.*',
        '!**/{bower.json,seed-element.html,.git,.npmignore,test}/**'],
      this.destinationPath(),
      { process: renameElement });

    this.fs.copy(
      this.templatePath('seed-element.html'),
      this.destinationPath(this.elementName + '.html'),
      { process: renameElement });

    // Remove WCT if the user opted out
    this.fs.copy(
      this.templatePath('bower.json'),
      this.destinationPath('bower.json'),
      { process: function (file) {
        var manifest =  JSON.parse(file.toString());
        manifest.name = this.elementName;
        manifest.main = this.elementName + '.html';
        if (!this.includeWCT) {
          delete manifest.devDependencies['web-component-tester'];
          delete manifest.devDependencies['test-fixture'];
        }
        return JSON.stringify(manifest, null, 2);
      }.bind(this) });

    if (this.includeWCT) {
      this.fs.copy(
        this.sourceRoot() + '/test/*',
        this.destinationPath('test'),
        { process: renameElement });
    }

    // Handle bug where npm has renamed .gitignore to .npmignore
    // https://github.com/npm/npm/issues/3763
    if (this.fs.exists('.npmignore')) {
      this.fs.copy(
        this.templatePath('.npmignore'),
        this.destinationPath('.gitignore')
      );
    } else {
      this.fs.copy(
        this.templatePath('.gitignore'),
        this.destinationPath('.gitignore')
      );
    }

  },
  install: function () {
    this.installDependencies({
      npm: false,
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  }
});
