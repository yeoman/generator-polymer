'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');
var ncp = require('ncp');
var spawn = require('child_process').spawn;
var rimraf = require('rimraf');

module.exports = yeoman.generators.Base.extend({
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
  },
  gh: function () {
    var done = this.async();
    var src = path.join(__dirname, 'templates');
    var dest = path.join(process.cwd(), 'tmp-' + Date.now());

    // work around weird timing issues with this.copy...
    ncp(src, dest, function (err) {
      if (err) {
        return this.log(err);
      }

      var gp = spawn('sh', ['gp.sh', this.ghUser, this.elementName], {cwd: dest});

      gp.stdout.on('data', function (data) {
        this.log(data.toString());
      }.bind(this));

      gp.stderr.on('data', function (data) {
        this.log(data.toString());
      }.bind(this));

      gp.on('close', function (code) {
        this.log('child process exited with code ' + code);
        rimraf.sync(dest);
        done();
      }.bind(this));
    }.bind(this));
  }
});
