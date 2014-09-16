'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          skipMessage: this.options['skip-install-message'],
          npm: false
        });
      }
    });
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Out of the box I include the Polymer seed-element.'));

    var defaultName = path.basename(process.cwd());
    var prompts = [
      {
        name: 'ghUser',
        message: 'What is your GitHub username?'
      },
      {
        name: 'elementName',
        message: 'What is your element\'s name',
        default: defaultName
      }
    ];

    this.prompt(prompts, function (props) {
      this.ghUser = props.ghUser;
      this.elementName = props.elementName

      done();
    }.bind(this));
  },
  seed: function () {
    if (this.elementName.indexOf('-') === -1) {
      console.error(
        'The element name you provided: ' + this.elementName + ' ' +
        'is invalid.'
      );
      console.error('Element name must contain a dash "-"');
      console.error('ex: my-element');
      return;
    }

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
  }
});
