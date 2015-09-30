'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var exec = require('child_process').exec;
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // ex: yo polymer:bo -component-name foo will
    // execute `bower install --save foo`
    this.argument('component-name', {
      desc: 'Component to be downloaded through bower',
      require: true
    });

  },
  init: function () {
    var generator = this;

    generator.componentName = generator['component-name'];
    var isSubProject = generator.componentName.indexOf('/'),

      //Extract the resolved component name after bower install.
      exactName = (isSubProject !== -1) ? generator.componentName.match(/[\/*](.*)/)[1] : generator.componentName;

    exec('bower install --save ' + generator.componentName, function (error, stdout, stderr) {
      if (error) { return console.log(error.message); }

      // Output the bower install log
      console.log(stdout);

      function includeImport(imports) {
        var file = generator.readFileAsString('app/elements/elements.html');
        file += '\n<!-- ' + exactName + ' Elements -->\n';
        if (Array.isArray(imports)) {
          _.each(imports, function (fileName) {
            fileName = fileName.replace(/\\/g, '/');
            if (path.extname(fileName) === '.html') {
              file += '<link rel="import" href="../bower_components/' + exactName + '/' + fileName + '">\n';
            }
          });

        } else {
          imports = imports.replace(/\\/g, '/');
          if (path.extname(imports) === '.html') {
            file += '<link rel="import" href="../bower_components' + exactName + '/' + imports + '">\n';
          }

        }

        return file;
      }

      try {
        var componentBowerFile = generator.readFileAsString(path.join('bower_components/', exactName, '/bower.json')),
          bowerJSON = JSON.parse(componentBowerFile);

        generator.writeFileFromString(includeImport(bowerJSON.main || ''), 'app/elements/elements.html');

      } catch (err) {
        //To catch file / folder missing post bower install
        console.log(err.message);

      }
    });
  }
});
