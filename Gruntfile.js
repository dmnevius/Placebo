module.exports = function (grunt) {
  grunt.initConfig({
    concat: {
      options: {
        banner: "/* Placebo v.<%= pkg.version %> - http://dmnevius.net/placebo */(function (context) {var version=\"<%= pkg.version %>\";",
        footer: "}(this));",
        separator: "\n"
      },
      dist: {
        src: ['src/core.js', 'src/parser.js', 'src/builder.js', 'src/interface.js', 'src/api.js', 'src/integration.js'],
        dest: 'dist/placebo.js'
      },
      full: {
        src: ['src/core.js', 'src/parser.js', 'src/builder.js', 'src/interface.js', 'src/api.js', 'src/integration.js', 'plugins/text.js', 'plugins/input.js', 'plugins/family.js'],
        dest: 'dist/placebo-full.js'
      }
    },
    connect: {
      server: {
        options: {
          keepalive: true,
          port: 3000
        }
      }
    },
    jsbeautifier: {
      files: ['dist/placebo.js', 'dist/placebo-full.js', 'plugins/text.js', 'plugins/input.js', 'plugins/family.js', 'tests/tests.js']
    },
    jshint: {
      files: ['src/core.js', 'src/builder.js', 'src/interface.js', 'src/ender.js', 'src/api.js', 'src/integration.js', 'plugins/text.js', 'plugins/input.js', 'plugins/family.js']
    },
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      target: {
        command: "cd src && pegjs --export-var placebo.parser parser.pegjs"
      }
    },
    uglify: {
      target: {
        files: {
          'dist/placebo.min.js': 'dist/placebo.js',
          'dist/placebo-full.min.js': 'dist/placebo-full.js'
        },
        options: {
          banner: "/* Placebo v.<%= pkg.version %> - http://dmnevius.net/placebo */"
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-shell');

  // Use default for normal changes and testing
  grunt.registerTask('default', ['jshint', 'concat', 'connect']);

  // Use build for preparing for a new release
  grunt.registerTask('build', ['shell', 'concat:full', 'uglify', 'jsbeautifier']);
}
