'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var htmlWiring = require('html-wiring');
var readFileAsString = htmlWiring.readFileAsString;
var writeFileFromString = htmlWiring.writeFileFromString;

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('element-name', {
      desc: 'Tag name of the element to generate',
      required: true
    });

    // This method adds support for a `--docs` flag
    // An element generated with --docs will include iron-component-page
    // and a demo.html file
    this.option('docs');

    // This method adds support for a `--path` flag
    // An element generated with a --path will create a matching directory
    // structure in the `app/elements` dir.
    // ex: yo polymer:el x-foo --path foo/bar/baz will create
    // app/elements/foo/bar/baz/x-foo
    this.option('path');
  },
  init: function () {
    this.elementName = this['element-name'];
    this.args.splice(0,1);
    this.components = this.args;
    this.flags = this.options;

    if (this.elementName.indexOf('-') === -1) {
      this.emit('error', new Error(
        'Element name must contain a dash "-"\n' +
        'ex: yo polymer:el my-element'
      ));
    }
  },
  askFor: function () {
    var done = this.async();

    var prompts = [
      {
        name: 'includeImport',
        message: 'Would you like to include an import in your elements.html file?',
        type: 'confirm',
        default: false
      }
    ];

    // Only ask to create a test if they already have WCT installed
    var hasWCTinstalled = this.fs.exists('app/test/index.html');
    if (hasWCTinstalled) {
      prompts.push({
        name: 'testType',
        message: 'What type of test would you like to create?',
        type: 'list',
        choices: ['TDD', 'BDD', 'None'],
        default: 'TDD'
      });
    }

    this.prompt(prompts, function (answers) {
      this.includeImport = answers.includeImport;
      this.testType = answers.testType;
      done();
    }.bind(this));
  },
  el: function () {
    // Create the template element

    var el;
    var pathToEl;

    if (this.flags.path) {

      // pathToEl = "app/elements/foo/bar/"
      pathToEl = path.join(this.destinationPath('app/elements'), this.flags.path);

    } else {

      // pathToEl = "app/elements/x-foo/"
      pathToEl = path.join(this.destinationPath('app/elements'), this.elementName);

    }

    // Used by element template
    var tpl = {
      elementName: this.elementName,
      components: this.components,
      pathToBower: path.relative(
          pathToEl,
          path.join(process.cwd(), 'app/bower_components')
        )
    };

    this.fs.copyTpl(
      path.join(this.templatePath('element.html')),
      path.join(pathToEl, this.elementName + '.html'),
      tpl
    );

    // Wire up the dependency in elements.html
    if (this.includeImport) {
      var file = readFileAsString(this.destinationPath('app/elements/elements.html'));
      el = (this.flags.path || this.elementName) + '/' + this.elementName;
      el = el.replace(/\\/g, '/');
      file += '<link rel="import" href="' + el + '.html">\n';
      writeFileFromString(file, this.destinationPath('app/elements/elements.html'));
    }

    if (this.testType && this.testType !== 'None') {
      var testDir = this.destinationPath('app/test');

      if (this.testType === 'TDD') {
        this.fs.copyTpl(
          this.templatePath('test/tdd.html'),
          path.join(testDir, this.elementName+'-basic.html'),
          tpl
        );
      } else if (this.testType === 'BDD') {
        this.fs.copyTpl(
          this.templatePath('test/bdd.html'),
          path.join(testDir, this.elementName+'-basic.html'),
          tpl
        );
      }

      // Open index.html, locate where to insert text, insert ", x-foo.html" into the array of components to test
      var indexFileName = 'app/test/index.html';
      var origionalFile = readFileAsString(this.destinationPath(indexFileName));
      var regex = /WCT\.loadSuites\(\[([^\]]*)/;
      var match = regex.exec(origionalFile);
      var indexOfInsertion = match.index + match[0].length;
      var comma = (match[1].length === 0) ? '' : ', ';
      var newFile = origionalFile.slice(0, indexOfInsertion) + comma + '\'' + this.elementName + '-basic.html\'' + origionalFile.slice(indexOfInsertion);
      writeFileFromString(newFile, indexFileName);
    }

    // copy documentation page and demo page only if flag is set
    if (this.flags.docs) {

      // copy templates/index.html -> app/elements/x-foo/index.html (documentation page)
      this.fs.copyTpl(
        this.templatePath('index.html'),
        path.join(pathToEl, 'index.html'),
        tpl
      );

      // copy templates/demo.html -> app/elements/x-foo/demo.html (demo page)
      this.fs.copyTpl(
        this.templatePath('demo.html'),
        path.join(pathToEl, 'demo/index.html'),
        tpl
      );

    }
  }
});
