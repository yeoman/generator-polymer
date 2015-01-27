'use strict';
var _ = require('lodash');
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
      desc: 'Whether bower dependencies should be installed',
      defaults: false,
    });

    this.option('skip-install-message', {
      desc: 'Whether commands run should be shown',
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
  },
  checkForDanger: function () {
    var done = this.async();

    // Because the element installs its dependencies as siblings, we want to
    // make it clear to the user that it is potentially dangerous to generate
    // their element from workspace containing other directories.
    var entries = this.expand('*');
    var bowerEntries = _.map(this.expand('*/bower.json'), path.dirname);
    var nonComponents = _.difference(entries, bowerEntries);

    // Whew, everything looks like a bower component!
    if (nonComponents.length === 0) {
      done();
      return;
    }

    console.warn(
      'You are generating your element in a workspace that appears to contain data\n' +
      'other than web components. This is potentially dangerous, as your element\'s\n' +
      'dependencies will be installed in the current directory. Bower will\n' +
      'overwrite any conflicting directories.\n'
    );

    var prompts = [{
      name: 'livesDangerously',
      message: 'Are you ok with that?',
      default: 'no',
    }];

    this.prompt(prompts, function (props) {
      if (props.livesDangerously[0] !== 'n') {
        done();
      }
    }.bind(this));
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Out of the box I follow the seed-element pattern.'));

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
    // Construct the element as a subdirectory.
    this.destinationRoot(this.elementName);

    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('bowerrc', '.bowerrc');
    this.template('bower.json', 'bower.json');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
    this.template('seed-element.css', this.elementName + '.css');
    this.template('seed-element.html', this.elementName + '.html');
    this.template('index.html', 'index.html');
    this.template('demo.html', 'demo.html');
    this.template('README.md', 'README.md');
    this.template('test/index.html', 'test/index.html');
    this.template('test/seed-element-basic.html',
                  'test/' + this.elementName + '-basic.html');
  },
  install: function () {
    this.installDependencies({
      npm: false,
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  }
});
