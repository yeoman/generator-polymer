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
      required: true,
    });

    this.option('skip-install', {
      desc: 'Whether bower dependencies should be installed',
      defaults: false,
    });

    this.option('skip-install-message', {
      desc: 'Whether commands run should be shown',
      defaults: false,
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

    var renameElement = function (file) {
      return file.replace(/seed-element/g, this.elementName);
    }.bind(this);

    // Handle bug where npm has renamed .gitignore to .npmignore
    // https://github.com/npm/npm/issues/3763
    if (this.src.isFile('.npmignore')) {
      this.copy('.npmignore', '.gitignore');
    } else {
      this.copy('.gitignore', '.gitignore');
    }

    this.copy('bower.json', 'bower.json', function(file) {
      var manifest = JSON.parse(file);
      manifest.name = this.elementName;
      manifest.main = this.elementName + '.html';
      if (!this.includeWCT) {
        delete manifest.devDependencies['web-component-tester'];
        delete manifest.devDependencies['test-fixture'];
      }
      return JSON.stringify(manifest, null, 2);
    }.bind(this));

    this.copy('index.html', 'index.html', renameElement);
    this.copy('README.md', 'README.md', renameElement);
    this.copy('seed-element.html', this.elementName + '.html', renameElement);
    this.copy('demo/index.html', 'demo/index.html', renameElement);

    if (this.includeWCT) {
      this.copy('test/index.html', 'test/index.html', renameElement);
      this.copy('test/basic-test.html', 'test/basic-test.html', renameElement);
    }
  },
  install: function () {
    this.installDependencies({
      npm: false,
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  }
});
