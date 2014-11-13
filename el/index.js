'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('element-name', {
      desc: 'Tag name of the element to generate',
      required: true,
    });
  },
  init: function () {
    this.elementName = this['element-name'];
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

    // el = "x-foo/x-foo"
    var el = path.join(this.elementName, this.elementName);
    // pathToEl = "app/elements/x-foo/x-foo"
    var pathToEl = path.join('app/elements', el);
    this.template('_element.html', pathToEl + '.html');
    if (this.externalStyle) {
      this.template('_element.css',
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
  }
});
