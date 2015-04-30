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
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('bowerrc', '.bowerrc');
    this.copy('bower.json', 'bower.json');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
    this.template('gulpfile.js');
    this.template('package.json', 'package.json');
    this.mkdir('app');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.mkdir('app/scripts');
    this.mkdir('app/elements');
    this.template('app/404.html');
    this.template('app/favicon.ico');
    this.template('app/robots.txt');
    this.copy('app/styles/main.css', 'app/styles/main.css');
    this.copy('app/scripts/app.js', 'app/scripts/app.js');
    this.copy('app/htaccess', 'app/.htaccess');
    this.copy('app/elements/elements.html', 'app/elements/elements.html');
    this.copy('app/elements/yo-list/yo-list.html', 'app/elements/yo-list/yo-list.html');
    this.copy('app/elements/yo-greeting/yo-greeting.html', 'app/elements/yo-greeting/yo-greeting.html');
    this.copy('app/index.html', 'app/index.html');
    if (this.includeWCT) {
      this.copy('wct.conf.js', 'wct.conf.js');
      this.directory('test', 'test');
    }
  },
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  }
});
