'use strict';

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('web-component-tester');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true
      },
      default: {
        files: [
          '<%%= yeoman.app %>/*.html',
          '<%%= yeoman.app %>/elements/{,*/}*.html',
          '{.tmp,<%%= yeoman.app %>}/elements/{,*/}*.{css,js}',
          '{.tmp,<%%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
        includePaths: ['bower_components']
        <% } else { %>
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
    browserSync: {
      options: {
        notify: false,
        port: 9000,
        open: true
      },
      app: {
        options: {
          watchTask: true,
          injectChanges: false, // can't inject Shadow DOM
          server: {
            baseDir: ['.tmp', '<%%= yeoman.app %>'],
            routes: {
              '/bower_components': 'bower_components'
            }
          }
        },
        src: [
          '.tmp/**/*.{css,html,js}',
          '<%%= yeoman.app %>/**/*.{css,html,js}'
        ]
      },
      dist: {
        options: {
          server: {
            baseDir: 'dist'
          }
        },
        src: [
          '<%%= yeoman.dist %>/**/*.{css,html,js}',
          '!<%%= yeoman.dist %>/bower_components/**/*'
        ]
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
        dirs: ['<%%= yeoman.dist %>']
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [{
            match: /\/elements\/elements\.html/g,
            replacement: '/elements/elements.vulcanized.html'
          }]
        },
        files: {
          '<%%= yeoman.dist %>/index.html': ['<%%= yeoman.dist %>/index.html']
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
          src: '{,*/}*.{png,jpg,jpeg,svg}',
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
        empty: true,
        spare: true
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
            'images/{,*/}*.{webp,gif}'
          ]
        }, {
          expand: true,
          dot: true,
          dest: '<%%= yeoman.dist %>',
          src: ['bower_components/**']
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
    'wct-test': {
      local: {
        options: {remote: false}
      },
      remote: {
        options: {remote: true}
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
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',<% if (includeSass) { %>
      'sass:server',<% } %>
      'copy:styles',
      'autoprefixer:server',
      'browserSync:app',
      'watch'
    ]);
  });

  grunt.registerTask('test:local', ['wct-test:local']);
  grunt.registerTask('test:remote', ['wct-test:remote']);

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
    'replace',
    'minifyHtml'
  ]);

  grunt.registerTask('default', [
    'jshint',
    // 'test'
    'build'
  ]);
};
