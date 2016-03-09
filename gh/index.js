'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');

module.exports = yeoman.Base.extend({
  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.option('nodevdeps', {
      desc: 'Whether devDependencies should be installed in the gh-pages branch',
      default: false
    });
    this.includeDevDeps = this.options.nodevdeps ? 'no' : 'yes';

    // Github Enterprise Support
    this.option('hostname',{
      desc: 'Github hostname to use. Necessary for Github Enterprise instances.',
      type: String,
      default: 'github.com'
    });
    this.ghHostname = this.options.hostname;
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('\'Allo! Looking to generate a Github Page are yah?'));

    var defaultName = path.basename(process.cwd());
    var prompts = [
      {
        name: 'ghUser',
        message: 'What is your GitHub username or organization?'
      },
      {
        name: 'elementName',
        message: 'What is your element\'s name',
        default: defaultName
      },
      {
        name: 'branch',
        message: 'What branch would you like to deploy from?',
        default: 'master'
      },
      {
        name: 'connectionType',
        message: 'Use HTTPS or SSH to connect to GitHub?',
        default: 'HTTPS'
      },
    ];

    this.prompt(prompts, function (props) {
      this.ghUser = props.ghUser;
      this.elementName = props.elementName;
      this.branch = props.branch;
      this.connectionType = props.connectionType.toLowerCase();

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
      ['gp.sh', this.ghHostname, this.ghUser, this.elementName, this.branch, this.connectionType, this.includeDevDeps],
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
