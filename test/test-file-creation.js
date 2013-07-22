/*global describe beforeEach it */
'use strict';
var path = require('path');
var helpers = require('yeoman-generator').test;

describe('Polymer generator', function () {
	beforeEach(function (cb) {
		var deps = ['../../app'];

		helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
			if (err) {
				return cb(err);
			}

			this.gen = helpers.createGenerator('polymer:app', deps);
			cb();
		}.bind(this));
	});

	it('generates expected files', function (cb) {
		var expected = ['polymer.min.js', 'polymer.min.js.map'];

		this.gen.run({}, function () {
			helpers.assertFiles(expected);
			cb();
		});
	});
});
