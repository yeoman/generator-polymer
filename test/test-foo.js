/*global describe:true, beforeEach:true, it:true */
'use strict';
var path    = require('path');
var helpers = require('yeoman-generator').test;
var assert  = require('assert');


// XXX With current API, (prior v2), that's a complete mess to setup generators
// if they differ from the standard lib/generators layout.
//
// Even for workarounds, the API is awful and doesn't let you do anything.
//
// With the new API, it will be much easier to manually register one or a set
// of generators, and manage multiple environments.
//
// Something like:
//
//    generators()
//      .register(require('../all'), 'backbone:all')
//      .register(require('../app'), 'backbone:app')
//      .register(require('../view'), 'backbone:view')
//      .register(require('../router'), 'backbone:router')
//      .register(require('../model'), 'backbone:model')
//      .register(require('../collection'), 'backbone:collection')
//
// Or for the lazy guy:
//
//    generators()
//      .lookup('*:*', path.join(__dirname, '..'))
//

/*
describe('Backbone generator test', function () {
  beforeEach(function (done) {
    helpers.testDirectory(path.join(__dirname, './temp'), function (err) {
      if (err) {
        return done(err);
      }
      this.backbone = {};
      this.backbone.app = helpers.createGenerator('backbone:app', [
        '../../app', [
          helpers.createDummyGenerator(),
          'mocha:app'
        ]
      ]);
      this.backbone.app.options['skip-install'] = true;

      helpers.mockPrompt(this.backbone.app, {
        'compassBootstrap': true,
        'includeRequireJS': false
      });

      done();
    }.bind(this));

  });

  it('every generator can be required without throwing', function () {
    // not testing the actual run of generators yet
    this.all = require('../all');
    this.app = require('../app');
    this.collection = require('../collection');
    this.model = require('../model');
    this.router = require('../router');
    this.view = require('../view');
  });

  it('creates expected files', function (done) {
    var expected = [
      ['bower.json', /"name": "temp"/],
      ['package.json', /"name": "temp"/],
      'Gruntfile.js',
      'app/404.html',
      'app/favicon.ico',
      'app/robots.txt',
      'app/index.html',
      'app/.htaccess',
      '.gitignore',
      '.gitattributes',
      '.bowerrc',
      '.jshintrc',
      '.editorconfig',
      'Gruntfile.js',
      'package.json',
      'app/scripts/main.js',
      'app/styles/main.scss',
      'app/images/glyphicons-halflings-white.png',
      'app/images/glyphicons-halflings.png'
    ];

    this.backbone.app.run({}, function () {
      helpers.assertFiles(expected);
      done();
    });

  });

  describe('Backbone Model', function () {
    it('creates backbone model', function (done) {
      var model = helpers.createGenerator('backbone:model', ['../../model'], ['foo']);

      this.backbone.app.run({}, function () {
        model.run([], function () {
          helpers.assertFiles([
            ['app/scripts/models/foo.js',
              /Models.FooModel = Backbone.Model.extend\(\{/]
          ]);
        });
        done();
      });
    });
  });

  describe('Backbone Collection', function () {
    it('creates backbone collection', function (done) {
      var collection = helpers.createGenerator('backbone:collection', ['../../collection'], ['foo']);

      this.backbone.app.run({}, function () {
        collection.run([], function () {
          helpers.assertFiles([
            ['app/scripts/collections/foo.js', /Collections.FooCollection = Backbone.Collection.extend\(\{/]
          ]);
        });
        done();
      });
    });
  });

  describe('Backbone Router', function () {
    it('creates backbone router', function (done) {
      var router = helpers.createGenerator('backbone:router', ['../../router'], ['foo']);

      this.backbone.app.run({}, function () {
        router.run([], function () {
          helpers.assertFiles([
            ['app/scripts/routes/foo.js', /Routers.FooRouter = Backbone.Router.extend\(\{/]
          ]);
        });
        done();
      });
    });
  });

  describe('Backbone View', function () {
    it('creates backbone view', function (done) {
      var view = helpers.createGenerator('backbone:view', ['../../view'], ['foo']);

      this.backbone.app.run({}, function () {
        view.run([], function () {
          helpers.assertFiles([
            ['app/scripts/views/foo.js', /Views.FooView = Backbone.View.extend\(\{(.|\n)*app\/scripts\/templates\/foo.ejs/],
            'app/scripts/templates/foo.ejs'
          ]);
        });
        done();
      });
    });
  });
});
*/
