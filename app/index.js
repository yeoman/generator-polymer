'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install', {
      desc:     'Whether dependencies should be installed',
      defaults: false,
    });

    this.option('skip-install-message', {
      desc:     'Whether commands run should be shown',
      defaults: false,
    });

    this.sourceRoot(path.join(path.dirname(this.resolved), 'templates/polymer-starter-kit'));
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Out of the box I include Polymer Starter Kit'));

    var prompts = [
      {
        name: 'includeWCT',
        message: 'Would you like to include web-component-tester?',
        type: 'confirm'
      },
      {
        name: 'includeRecipes',
        message: 'Would you like to include recipe docs?',
        type: 'confirm',
        default: false
      }
    ];

    this.prompt(prompts, function (answers) {
      this.includeWCT = answers.includeWCT;
      this.includeRecipes = answers.includeRecipes;
      done();
    }.bind(this));
  },
  app: function () {
    this.copy('.editorconfig', '.editorconfig');
    this.copy('.gitattributes', '.gitattributes');

    // Handle bug where npm has renamed .gitignore to .npmignore
    // https://github.com/npm/npm/issues/3763
    if (this.src.isFile('.npmignore')) {
      this.copy('.npmignore', '.gitignore');
    } else {
      this.copy('.gitignore', '.gitignore');
    }
    this.copy('.jscsrc', '.jscsrc');
    this.copy('.jshintrc', '.jshintrc');

    this.copy('bower.json', 'bower.json', function(file) {
      var manifest =  JSON.parse(file);
      if (!this.includeWCT) {
        delete manifest.devDependencies['web-component-tester'];
        delete manifest.devDependencies['test-fixture'];
      }
      return JSON.stringify(manifest, null, 2);
    }.bind(this));

    this.copy('gulpfile.js', 'gulpfile.js', function(file) {
      var clone = file;
      if (!this.includeWCT) {
        clone = file.replace(/require\('web-component-tester'\).+/g,
          function(match) {
            return '// ' + match;
          });
      }
      return clone;
    }.bind(this));

    this.copy('LICENSE.md', 'LICENSE.md');

    // Remove WCT if the user opted out
    this.copy('package.json', 'package.json', function(file) {
      var manifest =  JSON.parse(file);
      if (!this.includeWCT) {
        delete manifest.devDependencies['web-component-tester'];
      }
      return JSON.stringify(manifest, null, 2);
    }.bind(this));

    this.copy('README.md', 'README.md');

    if (this.includeWCT) {
      this.copy('wct.conf.json', 'wct.conf.json');
      this.directory('test', 'test');
    }

    this.mkdir('app');
    this.directory('app', 'app');

    if (this.includeRecipes) {
      this.directory('docs', 'docs');
    }
  },
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  }
});
