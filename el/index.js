'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');

module.exports = yeoman.generators.Base.extend({
  el: function () {
    this.elementName = this.args[0];
    if (!this.elementName) {
      console.error('Element name required');
      console.error('ex: yo polymer:el my-element');
      return
    }

    if (this.elementName.indexOf('-') === -1) {
      console.error('Element name must contain a dash "-"');
      console.error('ex: yo polymer:el my-element');
      return;
    }

    this.template('_element.html', 'app/elements/' + this.elementName + '.html');
  }
});
