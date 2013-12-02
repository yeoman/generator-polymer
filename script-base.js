'use strict';
var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var polymerUtils = require('./util.js');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (err) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee');

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.env.options.appPath, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }
};


util.inherits(Generator, yeoman.generators.NamedBase);


Generator.prototype.addImportToFile = function (options) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, options.fileName);

    polymerUtils.rewriteFile({
      file: fullPath,
      needle: options.needleHead || "</head>",
      splicable: [
        '<link rel="import" href="' + options.importUrl + '">'
      ]
    });

    polymerUtils.rewriteFile({
      file: fullPath,
      needle: options.needleBody || '</body>',
      splicable: [
        '      <' + options.tagName + '>' + '</' + options.tagName + '>'
      ]
    });

  } catch (e) {
    console.log('\nUnable to find full reference to path');
  }
};



