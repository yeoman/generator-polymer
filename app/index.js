'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');
var chalk = require('chalk');
var mkdirp = require('mkdirp');

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);

    this.option('skip-install', {
      desc:     'Whether dependencies should be installed',
      defaults: false
    });

    this.option('skip-install-message', {
      desc:     'Whether commands run should be shown',
      defaults: false
    });

    this.sourceRoot(path.join(path.dirname(this.resolved), 'templates/polymer-starter-kit'));
  },
  askFor: function () {
    var done = this.async();

    this.log(yosay(`Oh hai! We wanted to let you know that we\'re sunsetting
    this project and moving our efforts to Polymer CLI. The good news is it uses 
    Yeoman under the hood so I'll see you there! 
    https://github.com/Polymer/polymer-cli`));

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
    this.fs.copy([
      this.templatePath() + '/**',
      this.templatePath() + '/**/.*',
      '!**/{gulpfile.js,bower.json,package.json,.git,.npmignore,.gitignore,wct.conf.js,docs,test}/**'],
      this.destinationPath()
    );

    // Handle bug where npm has renamed .gitignore to .npmignore
    // https://github.com/npm/npm/issues/3763
    if (this.fs.exists(this.templatePath('.npmignore'))) {
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

    // Remove WCT if the user opted out
    this.fs.copy(
      this.templatePath('bower.json'),
      this.destinationPath('bower.json'),
      { process: function (file) {
        var manifest =  JSON.parse(file.toString());
        if (!this.includeWCT) {
          delete manifest.devDependencies['web-component-tester'];
        }
        return JSON.stringify(manifest, null, 2);
      }.bind(this) });

    // Remove WCT if the user opted out
    this.fs.copy(
      this.templatePath('gulpfile.js'),
      this.destinationPath('gulpfile.js'),
      { process: function (file) {
        var clone = file.toString();
        if (!this.includeWCT) {
          clone = clone.replace(/require\('web-component-tester'\).+/g,
            function(match) {
              return '// ' + match;
            });
        }
        return clone;
      }.bind(this) });

    // Remove WCT if the user opted out
    this.fs.copy(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { process: function (file) {
        var manifest =  JSON.parse(file.toString());
        if (!this.includeWCT) {
          delete manifest.devDependencies['web-component-tester'];
        }
        return JSON.stringify(manifest, null, 2);
      }.bind(this) });

    if (this.includeWCT) {
      this.fs.copy(
        this.templatePath('wct.conf.js'),
        this.destinationPath('wct.conf.js')
      );

      this.fs.copy(
        this.templatePath('app/test'),
        this.destinationPath('app/test')
      );
    }

    if (this.includeRecipes) {
      this.fs.copy(
        this.templatePath('docs'),
        this.destinationPath('docs')
      );
    }
  },
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  }
});
