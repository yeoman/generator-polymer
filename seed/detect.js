'use strict';
var path = require('path');
var shell = require('shelljs');

// Helpers for detecting the current state of the user's project.

module.exports = {

  /** @return {?String} The project's base name, or `null`. */
  currentProjectName: function () {
    // 99.9% of the time the directory is correct (thanks to the import ../
    // convention enforcing consistent directory names).
    return path.basename(process.cwd());
  },

  /** @return {?String} The project's current GitHub user/org, or `null`. */
  currentGithubUser: function () {
    var result = null;
    result = result || this._currentGithubUserFromReadme();
    result = result || this._currentGithubUserFromGit();
    return result;
  },

  // The only current location that this generate writes the github user to.
  _currentGithubUserFromReadme: function () {
    try {
      var readme = this.readFileAsString('README.md');
      var match  = readme.match(/\[component page\]\(http:\/\/([^\.]+)\.github\.io\//);
      return match && match[1];
    } catch (error) {
      return null;
    }
  },

  _currentGithubUserFromGit: function () {
    if (!shell.which('git')) return null;

    var result = shell.exec('git remote show -n origin', {silent: true});
    if (result.code !== 0) return null;

    var match = result.output.match(/Fetch URL:.*github\.com\/([^\/]+)\//);
    return match && match[1];
  },

};
