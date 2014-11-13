'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('element-name', {
      desc: 'Tag name of the element and directory to generate.',
      required: true,
    });

    this.option('skip-install', {
      desc:     'Whether bower dependencies should be installed',
      defaults: false,
    });

    this.option('skip-install-message', {
      desc:     'Whether commands run should be shown',
      defaults: false,
    });
  },
  validate: function () {
    this.elementName = this['element-name'];
    if (this.elementName.indexOf('-') === -1) {
      this.emit('error', new Error(
        'Element name must contain a dash "-"\n' +
        'ex: yo polymer:seed my-element'
      ));
    }

    // Construct the element as a subdirectory.
    this.destinationRoot(this.elementName);
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Out of the box I follow the seed-element pattern.'));

    var defaultName = path.basename(process.cwd());
    var prompts = [
      {
        name: 'ghUser',
        message: 'What is your GitHub username?'
      }
    ];

    this.prompt(prompts, function (props) {
      this.ghUser = props.ghUser;

      done();
    }.bind(this));
  },
  seed: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('bowerrc', '.bowerrc');
    this.template('_bower.json', 'bower.json');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
    this.template('_seed-element.css', this.elementName + '.css');
    this.template('_seed-element.html', this.elementName + '.html');
    this.template('_index.html', 'index.html');
    this.template('_demo.html', 'demo.html');
    this.template('_README.md', 'README.md');
    this.template('test/index.html', 'test/index.html');
    this.template('test/seed-element-basic.html',
                  'test/' + this.elementName + '-basic.html');
    this.template('test/tests.html', 'test/tests.html');
  },
  install: function () {
    this.installDependencies({
      npm: false,
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  }
});
