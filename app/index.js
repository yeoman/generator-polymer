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
    this.log(yosay('Out of the box I include HTML5 Boilerplate and Polymer'));

    var prompts = [{
        name: 'includeGulp',
        message: 'Would you prefer Gulp or Grunt?',
        type: 'list',
        choices: ['Gulp', 'Grunt']
      }, {
        name: 'includeCore',
        message: 'Would you like to include core-elements?',
        type: 'confirm'
      }, {
        name: 'includePaper',
        message: 'Would you like to include paper-elements?',
        type: 'confirm'
      }, {
        name: 'includeSass',
        message: 'Would you like to use SASS/SCSS for element styles?',
        type: 'confirm'
      }];

    this.prompt(prompts, function (answers) {
      this.includeGulp = answers.includeGulp == 'Gulp';
      this.includeCore = answers.includeCore;
      this.includePaper = answers.includePaper;
      this.includeSass = answers.includeSass;
      // LibSASS disabled until this is fixed
      // https://github.com/sass/libsass/issues/452
      this.includeLibSass = false;
      this.includeRubySass = answers.includeSass;

      // Save user configuration options to .yo-rc.json file
      this.config.set({
        includeSass: this.includeSass
      });
      this.config.save();

      done();
    }.bind(this));
  },
  app: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('bowerrc', '.bowerrc');
    this.copy('bower.json', 'bower.json');
    this.copy('wct.conf.js', 'wct.conf.js');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
    if (this.includeGulp) {
      this.template('gulpfile.js');
    } else {
      this.template('Gruntfile.js');
    }
    this.template('_package.json', 'package.json');
    this.mkdir('app');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.mkdir('app/scripts');
    this.mkdir('app/elements');
    this.template('app/404.html');
    this.template('app/favicon.ico');
    this.template('app/robots.txt');
    this.copy('app/main.css',
      this.includeSass ? 'app/styles/main.scss':
                         'app/styles/main.css');
    this.copy('app/app.js', 'app/scripts/app.js');
    this.copy('app/htaccess', 'app/.htaccess');
    this.copy('app/elements.html', 'app/elements/elements.html');
    this.copy('app/yo-list.html', 'app/elements/yo-list/yo-list.html');
    this.copy('app/yo-list.css',
      this.includeSass ? 'app/elements/yo-list/yo-list.scss':
                         'app/elements/yo-list/yo-list.css');
    this.copy('app/yo-greeting.html', 'app/elements/yo-greeting/yo-greeting.html');
    this.copy('app/yo-greeting.css',
      this.includeSass ? 'app/elements/yo-greeting/yo-greeting.scss':
                         'app/elements/yo-greeting/yo-greeting.css');
    this.copy('app/index.html', 'app/index.html');
    this.directory('test', 'app/test');
  },
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  }
});
