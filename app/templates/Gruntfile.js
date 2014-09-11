'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: { liveCSS: false }
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%%= yeoman.app %>/*.html',
          '<%%= yeoman.app %>/elements/{,*/}*.html',
          '{.tmp,<%%= yeoman.app %>}/elements/{,*/}*.css',
          '{.tmp,<%%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      },
      js: {
        files: ['<%%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      styles: {
        files: [
          '<%%= yeoman.app %>/styles/{,*/}*.css',
          '<%%= yeoman.app %>/elements/{,*/}*.css'
        ],
        tasks: ['copy:styles', 'autoprefixer:server']
      }<% if (includeSass) { %>,
      sass: {
        files: [
          '<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}',
          '<%%= yeoman.app %>/elements/{,*/}*.{scss,sass}'
        ],
        tasks: ['sass:server', 'autoprefixer:server']
      }<% } %>
    },<% if (includeSass) { %>
    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {<% if (includeLibSass) { %>
        sourceMap: true,
        includePaths: ['bower_components']
        <% } else { %>
        sourcemap: true,
        loadPath: 'bower_components'
      <% } %>},
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: ['styles/{,*/}*.{scss,sass}', 'elements/{,*/}*.{scss,sass}'],
          dest: '<%%= yeoman.dist %>',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: ['styles/{,*/}*.{scss,sass}', 'elements/{,*/}*.{scss,sass}'],
          dest: '.tmp',
          ext: '.css'
        }]
      }
    },<% } %>
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      server: {
        files: [{
          expand: true,
          cwd: '.tmp',
          src: '**/*.css',
          dest: '.tmp'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.dist %>',
          src: ['**/*.css', '!bower_components/**/*.css'],
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: {
            target: 'http://localhost:<%%= connect.options.port %>/test/runner.html'
          },
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.app)
            ];
          },
          keepalive: true
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>'
      }
    },
    clean: {
      dist: ['.tmp', '<%%= yeoman.dist %>/*'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    useminPrepare: {
      html: '<%%= yeoman.app %>/index.html',
      options: {
        dest: '<%%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%%= yeoman.dist %>'],
        blockReplacements: {
          vulcanized: function (block) {
            return '<link rel="import" href="' + block.dest + '">';
          }
        }
      }
    },
    vulcanize: {
      default: {
        options: {
          strip: true
        },
        files: {
          '<%%= yeoman.dist %>/elements/elements.vulcanized.html': [
            '<%%= yeoman.dist %>/elements/elements.html'
          ]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%%= yeoman.dist %>/images'
        }]
      }
    },<% if (!includeSass) { %>
    cssmin: {
      main: {
        files: {
          '<%%= yeoman.dist %>/styles/main.css': [
            '.tmp/concat/styles/{,*/}*.css'
          ]
        }
      },
      elements: {
        files: [{
          expand: true,
          cwd: '.tmp/elements',
          src: '{,*/}*.css',
          dest: '<%%= yeoman.dist %>/elements'
        }]
      }
    },<% } %>
    minifyHtml: {
      options: {
        quotes: true,
        empty: true
      },
      app: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.dist %>',
          src: '*.html',
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            '*.html',
            'elements/**',<% if (includeSass) { %>
            '!elements/**/*.scss',<% } else { %>
            '!elements/**/*.css',<% } %>
            'images/{,*/}*.{webp,gif}',
            'bower_components/**'
          ]
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          dest: '.tmp',
          src: ['{styles,elements}/{,*/}*.css']
        }]
      }
    },
    // See this tutorial if you'd like to run PageSpeed
    // against localhost: http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/
    pagespeed: {
      options: {
        // By default, we use the PageSpeed Insights
        // free (no API key) tier. You can use a Google
        // Developer API key if you have one. See
        // http://goo.gl/RkN0vE for info
        nokey: true
      },
      // Update `url` below to the public URL for your site
      mobile: {
        options: {
          url: "https://developers.google.com/web/fundamentals/",
          locale: "en_GB",
          strategy: "mobile",
          threshold: 80
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',<% if (includeSass) { %>
      'sass:server',<% } %>
      'copy:styles',
      'autoprefixer:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'connect:test'
  ]);

  grunt.registerTask('build', [
    'clean:dist',<% if (includeSass) { %>
    'sass',<% } %>
    'copy',
    'useminPrepare',
    'imagemin',
    'concat',
    'autoprefixer',
    'uglify',<% if (!includeSass) { %>
    'cssmin',<% } %>
    'vulcanize',
    'usemin',
    'minifyHtml'
  ]);

  grunt.registerTask('default', [
    'jshint',
    // 'test'
    'build'
  ]);
};
