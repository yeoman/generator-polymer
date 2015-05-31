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

    this.prompt(prompts, function (answers) {
      this.includeImport = answers.includeImport;
      done();
    }.bind(this));
  },
  el: function () {
    // Create the template element

    var el;
    var pathToEl;

    if (this.flags.path) {

      // --path foo/bar
      // el = "foo/bar/x-foo"
      el = path.join(this.flags.path, this.elementName);

      // pathToEl = "app/elements/foo/bar/x-foo"
      pathToEl = path.join('app/elements', el);

    } else {

      // el = "x-foo/x-foo"
      el = path.join(this.elementName, this.elementName);

      // pathToEl = "app/elements/x-foo/x-foo"
      pathToEl = path.join('app/elements', el);

    }

    // Used by element template
    this.pathToBower = path.relative(
      path.dirname(pathToEl),
      path.join(process.cwd(), 'app/bower_components')
    );
    this.template(path.join(__dirname, 'templates/element.html'), pathToEl + '.html');

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
      this.template(path.join(__dirname, 'templates/_demo.html'), path.join(pathToElementDir, 'demo/index.html'));
    }
  }
});
