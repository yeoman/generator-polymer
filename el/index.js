'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('element-name', {
      desc: 'Tag name of the element to generate',
      required: true
    });

    // This method adds support for a `--docs` flag
    // An element generated with --docs will include core-component-pages
    // and a demo.html file
    this.option('docs');
  },
  init: function () {
    this.elementName = this['element-name'];
    this.args.splice(0,1);
    this.components = this.args;
    this.flags = this.options;

    if (this.elementName.indexOf('/') > 1) { //path param was given
      var elPathArr = [], path = this.elementName.split('/').reverse();
      for (var i = 0; i < path.length; i++) {
        if (path.length - 1 === i) {
          elPathArr.push(path[i]);
        }
      }
      this.elPath = elPathArr.join('/');
      this.elHtmlName = path[0];
    }
    if (this.elementName.indexOf('-') === -1) {
      this.emit('error', new Error(
        'Element name must contain a dash "-"\n' +
        'ex: yo polymer:el my-element'
      ));
    }
  },
  askFor: function () {
    var done = this.async();
    var includeSass = this.config.get('includeSass');
    var styleType = includeSass ? 'SCSS' : 'CSS';

    var prompts = [
      {
        name: 'externalStyle',
        message: 'Would you like an external ' + styleType + ' file for this element?',
        type: 'confirm'
      },
      {
        name: 'includeImport',
        message: 'Would you like to include an import in your elements.html file?',
        type: 'confirm',
        default: false
      }
    ];

    this.prompt(prompts, function (answers) {
      this.includeSass = includeSass;
      this.externalStyle = answers.externalStyle;
      this.includeImport = answers.includeImport;
      done();
    }.bind(this));
  },
  el: function () {
    // Create the template element
    var el; // el = "x-foo/x-foo" || "yourpath/your-element";

    if(this.elementName.indexOf('/') > 0) {
      //get what/the/path/elName is;
      el = path.join(this.elPath, this.elHtmlName, this.elHtmlName);
    } else {
      el = path.join(this.elementName, this.elementName);
    }
    // pathToEl = "app/elements/x-foo/x-foo"
    var pathToEl = path.join('app/elements', el);
    this.template(path.join(__dirname, 'templates/element.html'), pathToEl + '.html');
    if (this.externalStyle) {
      this.template(path.join(__dirname, 'templates/element.css'),
        this.includeSass ? pathToEl + '.scss':
                           pathToEl + '.css');
    }

    // Wire up the dependency in elements.html
    if (this.includeImport) {
      var file = this.readFileAsString('app/elements/elements.html');
      el = el.replace('\\', '/');
      file += '<link rel="import" href="' + el + '.html">\n';
      this.writeFileFromString(file, 'app/elements/elements.html');
    }

    // copy documentation page and demo page only if flag is set
    if (this.flags.docs) {
      var elementDir = 'app/elements';

      // pathToElementDir = "app/elements/x-foo"
      var pathToElementDir = path.join(elementDir, this.elementName);

      // copy templates/_index.html -> app/elements/x-foo/index.html (documentation page)
      this.template(path.join(__dirname, 'templates/_index.html'), path.join(pathToElementDir, 'index.html'));

      // copy templates/_demo.html -> app/elements/x-foo/demo.html (demo page)
      this.template(path.join(__dirname, 'templates/_demo.html'), path.join(pathToElementDir, 'demo.html'));
    }
  }
});
