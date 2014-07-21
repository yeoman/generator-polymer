'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    this.testFramework = this.options['test-framework'] || 'mocha';

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message']
        });
      }
    });
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Out of the box I include HTML5 Boilerplate and Polymer'));

    var defaultName = path.basename(process.cwd());
    var prompts = [
      {
        name: 'includeCore',
        message: 'Would you like to include core-elements?',
        type: 'confirm'
      },
      {
        name: 'includePaper',
        message: 'Would you like to include paper-elements?',
        type: 'confirm'
      }
    ];

    this.prompt(prompts, function (props) {
      this.includeCore = props.includeCore;
      this.includePaper = props.includePaper;

      done();
    }.bind(this));
  },
  app: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
    this.template('Gruntfile.js');
    this.template('_package.json', 'package.json');
    this.mkdir('app');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.mkdir('app/scripts');
    this.mkdir('app/elements');
    this.template('app/404.html');
    this.template('app/favicon.ico');
    this.template('app/robots.txt');
    this.copy('app/main.css', 'app/styles/main.css');
    this.copy('app/app.js', 'app/scripts/app.js');
    this.copy('app/htaccess', 'app/.htaccess');
    this.copy('app/elements.html', 'app/elements/elements.html');
    this.copy('app/yo-list.html', 'app/elements/yo-list.html');
    this.copy('app/yo-greeting.html', 'app/elements/yo-greeting.html');
    this.copy('app/index.html', 'app/index.html');
  }
});
