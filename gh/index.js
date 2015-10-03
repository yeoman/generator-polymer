'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);
    this.option('nodevdeps', {
      desc: 'Whether devDependencies should be installed in the gh-pages branch',
      default: false
    });
    this.includeDevDeps = this.options.nodevdeps ? 'no' : 'yes';
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('\'Allo! Looking to generate a Github Page are yah?'));

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
      this.elementName = props.elementName;

      done();
    }.bind(this));

    // Create a tmp dir to run our process in
    this.destinationRoot('tmp-' + Date.now());
  },
  copy: function () {
    this.fs.copy(
      this.templatePath('gp.sh'),
      this.destinationPath('gp.sh')
    );
  },
  end: function () {
    var done = this.async();

    var gp = spawn(
      'bash',
      ['gp.sh', this.ghUser, this.elementName, 'master', this.includeDevDeps],
      {cwd: this.destinationRoot()}
    );

    gp.stdout.on('data', function (data) {
      this.log(data.toString());
    }.bind(this));

    gp.stderr.on('data', function (data) {
      this.log(data.toString());
    }.bind(this));

    gp.on('close', function (code) {
      this.log('child process exited with code ' + code);
      rimraf.sync(this.destinationRoot());
      done();
    }.bind(this));
  }
});
