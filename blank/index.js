'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('project-name', {
      desc: 'Name of the project you are generating',
      required: true
    });

    // this was made an optional CL arg because imho polymer:blank
    // shouldn't query user, just auto create a basic no-frills project
    this.option('use-wct', {
      desc:     'Use web-component-tester',
      defaults: false
    });
    // still a little wonky; query asks for Y/n, but occasionally doesn't show up correctly (stdout probably not flushed deterministically)
    // ideally, should default to Y, without query, but not sure how to do :( fix suggestion would be great
    this.option('test-element', {
      desc:     'Create a single test element included in index.html',
      defaults: false
    });

    this.option('skip-install', {
      desc:     'Whether dependencies should be installed',
      defaults: false
    });

    this.option('skip-install-message', {
      desc:     'Whether commands run should be shown',
      defaults: false
    });

    this.sourceRoot(path.join(path.dirname(this.resolved), 'templates/polymer-blank-kit'));
  },
  init: function () {
    this.dest = path.resolve(this['project-name']);
    this.projectName = path.basename(this.dest); // for the template html
    this.app = path.join(this.dest, 'app'); // for convenience
    this.includeWCT = this.options['use-wct'];
    this.testElement = this.options['test-element'];
  },
  blank: function () {
    this.mkdir(this.dest);
    this.directory(this.dest);
    var dests =
        ['.editorconfig', '.gitattributes','.jscsrc', '.jshintrc', 'bower.json',
        '.gitignore',
         'gulpfile.js', 'README.md', 'LICENSE.md', 'package.json'];
    for (var i in dests) {
      var src = dests[i];
      var f = dests[i];
      var fun = undefined;
      switch (src){
        case '.gitignore':
        // Handle bug where npm has renamed .gitignore to .npmignore
        // https://github.com/npm/npm/issues/3763
        if (this.src.isFile('.npmignore')) {
          src = '.npmignore';
        }
        break;
      case 'bower.json':
        fun = function (file) {
          var manifest =  JSON.parse(file);
          if (!this.includeWCT) {
            delete manifest.devDependencies['web-component-tester'];
            delete manifest.devDependencies['test-fixture'];
          }
          return JSON.stringify(manifest, null, 2);
        }.bind(this);
        break;
      case 'package.json':
        fun = function (file) {
          var manifest =  JSON.parse(file);
          if (!this.includeWCT) {
            delete manifest.devDependencies['web-component-tester'];
          }
          return JSON.stringify(manifest, null, 2);
        }.bind(this);
        break;
      default: // don't need this but if new cases are added, or logic changes, evil occurs
        break;
      }
      this.copy(src, path.join(this.dest, f), fun);
    }

    if (this.includeWCT) {
      this.copy('wct.conf.json', path.join(this.dest, 'wct.conf.json'));
      this.mkdir(path.join(this.app, 'test'));
      this.directory('test', path.join(this.app, 'test'));
    }

    this.mkdir(this.app);
    this.directory('app', this.app);

    if (this.testElement) {
      this.invoke('polymer:el', {options: {}, args: ['test-element']});
    }

  },
  install: function () {
    process.chdir(this.dest); // so we `npm install` and `bower install` successfully
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  }
});
