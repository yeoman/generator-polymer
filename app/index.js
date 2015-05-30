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

    var prompts = [{
        name: 'includeWCT',
        message: 'Would you like to include web-component-tester?',
        type: 'confirm'
      }];

    this.prompt(prompts, function (answers) {
      this.includeWCT = answers.includeWCT;
      done();
    }.bind(this));
  },
  app: function () {
    this.copy('.bowerrc', '.bowerrc');
    this.copy('.editorconfig', '.editorconfig');
    this.copy('.gitattributes', '.gitattributes');
    this.copy('.gitignore', '.gitignore');
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

    this.copy('gulpfile.js', 'gulpfile.js');
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
      this.copy('wct.conf.js', 'wct.conf.js');
      this.directory('test', 'test');
    }

    this.mkdir('app');
    this.directory('app', 'app');
  },
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  }
});
