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
      desc: 'Use web-component-tester',
      defaults: false
    });
    // still a little wonky; query asks for Y/n, but occasionally doesn't show up correctly (stdout probably not flushed deterministically)
    // ideally, should default to Y, without query, but not sure how to do :( fix suggestion would be great
    this.option('test-element', {
      desc: 'Create a single test element included in index.html',
      defaults: false
    });

    this.option('skip-install', {
      desc: 'Whether dependencies should be installed',
      defaults: false
    });

    this.option('skip-install-message', {
      desc: 'Whether commands run should be shown',
      defaults: false
    });
  },
  init: function () {
    this.dest = path.resolve(this['project-name']);
    this.projectName = path.basename(this.dest); // for the template html
    this.includeWCT = this.options['use-wct'];
    this.testElement = this.options['test-element'];
    this.indexTemplate = path.join(this.sourceRoot(), 'index.html'); // store this for later
    // path setting
    var psk = path.join('..', '..', 'app', 'templates', 'polymer-starter-kit');
    this.sourceRoot(path.resolve(this.sourceRoot(), psk));
    this.destinationRoot(this.dest);
    this.app = path.join(this.destinationRoot(), 'app'); // for convenience
  },
  blank: function () {

    // begin copy polymer-starter-kit base template files
    var simpleFiles = ['.editorconfig', '.gitattributes', '.jscsrc', '.jshintrc',
      'gulpfile.js', 'README.md', 'LICENSE.md'
    ];

    // loop and copy the 'simple files'
    for (var i in simpleFiles) {
      var f = simpleFiles[i];
      this.copy(f, f);
    }
    // Handle bug where npm has renamed .gitignore to .npmignore
    // https://github.com/npm/npm/issues/3763
    var gitignoresrc = '.gitignore';
    if (this.src.isFile('.npmignore')) {
      gitignoresrc = '.npmignore';
    }
    this.copy(gitignoresrc, '.gitignore');

    //bower
    this.copy('bower.json', 'bower.json', function (file) {
      var manifest = JSON.parse(file);
      if (!this.includeWCT) {
        delete manifest.devDependencies['web-component-tester'];
        delete manifest.devDependencies['test-fixture'];
      }
      manifest.name = this.projectName; // set the manifest to the project name
      return JSON.stringify(manifest, null, 2);
    }.bind(this));

    //package
    this.copy('package.json', 'package.json', function (file) {
      var manifest = JSON.parse(file);
      if (!this.includeWCT) {
        delete manifest.devDependencies['web-component-tester'];
      }
      return JSON.stringify(manifest, null, 2);
    }.bind(this));
    // end base file copy


    // begin app directory copy
    this.mkdir('app');

    if (this.includeWCT) {
      this.copy('wct.conf.json', 'wct.conf.json');
      this.mkdir(path.join(this.app, 'test'));
      this.directory('test', path.join(this.app, 'test'));
    }

    // update source and dest roots
    this.sourceRoot(path.join(this.sourceRoot(), 'app'));
    this.destinationRoot(this.app);

    this.copy('robots.txt', 'robots.txt');
    var elements = path.join('elements', 'elements.html');

    this.copy(elements, elements, function (file) {
      var imports = file.split('\n');
      var i = imports.length;

      while (i--){ // go backwards
        if (imports[i] === '<!-- Add your elements here -->'){ // yes this breaks encapsulation
          // but either we control the template, or we have to have knowledge about the template
          imports = imports.slice(0, i+1);
          imports.push('\n');
          return imports.join('\n');
        }
      }

      return file;
    });

    this.copy(this.indexTemplate, 'index.html'); // copy the special template
    // end app directory copy

    // add test element if requested
    if (this.testElement) {
      this.invoke('polymer:el', {
        options: {},
        args: ['test-element']
      });
    }

  },
  install: function () {
    this.destinationRoot(this.dest); // so we `npm install` and `bower install` successfully
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message']
    });
  }
});
