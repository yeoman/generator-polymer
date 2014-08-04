'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  askFor: function () {
    var done = this.async();

    var includeSass = this.config.get('includeSass');
    var styleType = includeSass ? 'SCSS' : 'CSS';

    var prompts = [
      {
        name: 'externalStyle',
        message: 'Would you like an external ' + styleType + ' file for this element?',
        type: 'confirm'
      }
    ];

    this.prompt(prompts, function (answers) {
      this.includeSass = includeSass;
      this.externalStyle = answers.externalStyle;

      done();
    }.bind(this));
  },
  el: function () {
    this.elementName = this.args[0];
    if (!this.elementName) {
      console.error('Element name required');
      console.error('ex: yo polymer:el my-element');
      return;
    }

    if (this.elementName.indexOf('-') === -1) {
      console.error('Element name must contain a dash "-"');
      console.error('ex: yo polymer:el my-element');
      return;
    }

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
    var file = this.readFileAsString('app/elements/elements.html');
    file += '<link rel="import" href="' + el + '.html">\n';
    this.writeFileFromString(file, 'app/elements/elements.html');
  }
});
